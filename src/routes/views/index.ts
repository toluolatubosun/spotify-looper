import JWT from "jsonwebtoken";
import express, { Router } from "express";

import { CONFIGS } from "@/configs";
import { prisma } from "@/libraries/prisma";
import SpotifyClient from "@/libraries/spotify";

const router: Router = express.Router();

router.get("/home", (_req, res) => {
    return res.render("home", { title: "Home" });
});

router.get("/login", (req, res) => {
    if (req.cookies.access_token) return res.redirect("/app");

    return res.render("login", { title: "Login" });
});

router.get("/app", async (req, res) => {
    if (!req.cookies.access_token) return res.redirect("/login");

    const { access_token } = req.cookies;
    const { user_id } = JWT.verify(access_token, CONFIGS.JWT_SECRET) as { user_id: string };

    const user = await prisma.user.findUnique({ where: { id: user_id } });

    const spotifyToken = await prisma.spotifyToken.findUnique({ where: { user_id } });
    if (!spotifyToken) throw new Error("Spotify token not found");

    const spotifyClient = new SpotifyClient({ access_token: spotifyToken.access_token, refresh_token: spotifyToken.refresh_token });
    const currentPlayingTrack = await spotifyClient.getCurrentPlayingTrack();

    return res.render("app", { title: "App", user, currentPlayingTrack });
});

export default router;
