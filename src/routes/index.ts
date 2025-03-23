import express, { Router, Request, Response } from "express";

import v1Routes from "@/routes/v1";
import viewRoutes from "@/routes/views";
import trimIncomingRequests from "@/middlewares/trim-incoming.middleware";

// import { APP_VERSION, CONFIGS, DEPLOYMENT_ENV } from "@/configs";

const router: Router = express.Router();

// Trim edge whitepase from incoming requests
router.use(trimIncomingRequests);

router.use("/v1", v1Routes);

router.use("/", viewRoutes);

router.get("/", (_req: Request, res: Response) => {
    // return res.status(200).json({
    //     version: APP_VERSION,
    //     environment: DEPLOYMENT_ENV,
    //     server_timezone: process.env.TZ,
    //     server_time: new Date().toISOString(),
    //     message: `Hello world from looper !! 🚀... Go to ${CONFIGS.URL.APP_BASE_URL}/home`,
    // });

    return res.redirect("/home");
});

export default router;
