import express, { Router } from "express";

import v1AuthRoute from "@/routes/v1/auth.route";
import v1SpotifyRoute from "@/routes/v1/spotify.route";

const router: Router = express.Router();

router.use("/auth", v1AuthRoute);

router.use("/spotify", v1SpotifyRoute);

export default router;
