import { z } from "zod";
import validator from "validator";
import express, { Router } from "express";

import response from "@/utilities/response";
import { prisma } from "@/libraries/prisma";
import SpotifyClient from "@/libraries/spotify";
import auth from "@/middlewares/auth.middleware";
import CustomError from "@/utilities/custom-error";
import { extractZodError } from "@/utilities/helpful-methods";

const router: Router = express.Router();

router.post("/loop/api", auth, async (req, res) => {
    const { error, data } = z
        .object({
            body: z.object({
                start_timestamp: z
                    .string()
                    .trim()
                    .refine((value) => validator.isTime(value), { message: "Invalid timestamp format" }),
                end_timestamp: z
                    .string()
                    .trim()
                    .refine((value) => validator.isTime(value), { message: "Invalid timestamp format" }),
                client_id: z.string().trim(),
            }),
            $spotifyToken: z.object({
                access_token: z.string(),
                refresh_token: z.string(),
            }),
            $user: z.object({
                id: z.string(),
            }),
        })
        .safeParse({ body: req.body, $spotifyToken: req.$spotifyToken, $user: req.$user });
    if (error) throw new CustomError(extractZodError(error));

    // parse timestamp
    const [endMinutes, endSeconds] = data.body.end_timestamp.split(":").map(Number);
    const [startMinutes, startSeconds] = data.body.start_timestamp.split(":").map(Number);
    const endTimestampInSeconds = Number(endMinutes) * 60 + Number(endSeconds);
    const startTimestampInSeconds = Number(startMinutes) * 60 + Number(startSeconds);

    const spotifyClient = new SpotifyClient({
        access_token: data.$spotifyToken.access_token,
        refresh_token: data.$spotifyToken.refresh_token,
    });

    // Refresh access token
    const tokens = await spotifyClient.refreshAccessToken();
    await prisma.spotifyToken.update({
        where: { user_id: data.$user.id },
        data: { access_token: tokens.access_token },
    });

    // Get current playing track
    const currentPlayingTrack = await spotifyClient.getCurrentPlayingTrack();
    if (!currentPlayingTrack.item) throw new CustomError("No track is currently playing", 400);

    // Check if the end timestamp is greater than the track duration
    const trackDurationInSeconds = currentPlayingTrack.item.duration_ms / 1000;
    if (endTimestampInSeconds > trackDurationInSeconds) throw new CustomError("End timestamp is greater than the track duration", 400);
    if (startTimestampInSeconds >= endTimestampInSeconds) throw new CustomError("Start timestamp is greater than or equal the end timestamp", 400);

    // Upsert the loop
    const spotifyLoop = await prisma.spotifyLoop.upsert({
        where: { user_id: data.$user.id },
        update: {
            client_id: data.body.client_id,
            track_id: currentPlayingTrack.item.id,
            end_timestamp: data.body.end_timestamp,
            start_timestamp: data.body.start_timestamp,
        },
        create: {
            user_id: data.$user.id,
            client_id: data.body.client_id,
            track_id: currentPlayingTrack.item.id,
            end_timestamp: data.body.end_timestamp,
            start_timestamp: data.body.start_timestamp,
        },
    });

    res.status(200).json(response("Loop set successfully", spotifyLoop, true));
});

router.post("/loop/go-to-start/api", auth, async (req, res) => {
    const { error, data } = z
        .object({
            body: z.object({
                client_id: z.string(),
                spotify_loop_id: z.string(),
            }),
            $spotifyToken: z.object({
                access_token: z.string(),
                refresh_token: z.string(),
            }),
            $user: z.object({
                id: z.string(),
            }),
        })
        .safeParse({ body: req.body, $spotifyToken: req.$spotifyToken, $user: req.$user });
    if (error) throw new CustomError(extractZodError(error));

    const spotifyClient = new SpotifyClient({
        access_token: data.$spotifyToken.access_token,
        refresh_token: data.$spotifyToken.refresh_token,
    });

    // Get the loop
    const spotifyLoop = await prisma.spotifyLoop.findUnique({ where: { id: data.body.spotify_loop_id, user_id: data.$user.id, client_id: data.body.client_id } });
    if (!spotifyLoop) throw new CustomError("Loop not found", 404);

    // Move to the start position
    const seekTo = spotifyLoop.start_timestamp.split(":").reduce((acc: number, time: string): number => 60 * acc + +time, 0);
    await spotifyClient.seekToPosition(seekTo * 1000);

    res.status(200).json(response("Seeked to start position", null, true));
});

export default router;
