import JWT from "jsonwebtoken";
import express, { Router } from "express";

import { prisma } from "@/libraries/prisma";
import SpotifyClient from "@/libraries/spotify";
import { CONFIGS } from "@/configs";
import CustomError from "@/utilities/custom-error";
import { z } from "zod";
import { extractZodError } from "@/utilities/helpful-methods";

const router: Router = express.Router();

router.get("/spotify/login", (_req, res) => {
    const spotifyClient = new SpotifyClient();
    const response = spotifyClient.generateAuthorizationURL();

    return res.redirect(response.authorization_url);
});

router.get("/spotify/callback", async (req, res) => {
    const { error, data } = z
        .object({
            query: z.object({
                code: z.string(),
            }),
        })
        .safeParse({ query: req.query });
    if (error) throw new CustomError(extractZodError(error));

    const spotifyClient = new SpotifyClient();
    const response = await spotifyClient.getAccessToken(String(data.query.code));

    const spotifyUserProfile = await spotifyClient.getUserProfile();

    // create a user account
    const user = await prisma.user.upsert({
        where: { spotify_id: spotifyUserProfile.id },
        update: {},
        create: {
            email: spotifyUserProfile.email,
            spotify_id: spotifyUserProfile.id,
            name: spotifyUserProfile.display_name,
        },
    });

    // store the user's access and refresh tokens
    await prisma.spotifyToken.upsert({
        where: { user_id: user.id },
        update: {
            scope: response.scope,
            token_type: response.token_type,
            access_token: response.access_token,
            refresh_token: response.refresh_token,
        },
        create: {
            user_id: user.id,
            scope: response.scope,
            token_type: response.token_type,
            access_token: response.access_token,
            refresh_token: response.refresh_token,
        },
    });

    const accessToken = JWT.sign({ user_id: user.id }, CONFIGS.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("access_token", accessToken, { httpOnly: true });
    res.redirect("/app");
});

export default router;
