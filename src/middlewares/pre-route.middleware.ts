import cors from "cors";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { CONFIGS } from "@/configs";

const configurePreRouteMiddleware = (app: Express): Express => {
    // Set the view engine to ejs
    app.set("view engine", "ejs");

    // enable CORS
    app.use(
        cors({
            credentials: true,
            origin: [...CONFIGS.CORS_ALLOWED_ORIGINS],
        })
    );

    app.use(cookieParser());

    // Secure the app by setting various HTTP headers off.
    app.use(helmet({ contentSecurityPolicy: false }));

    // Enable HTTP request logging
    app.use(morgan("common"));

    // Tell express to recognize the incoming Request Object as a JSON Object
    app.use(express.json());

    // Serve Public Folder
    app.use("/", express.static(path.join(__dirname, "..", "..", "public")));

    // Express body parser
    app.use(express.urlencoded({ extended: true }));

    return app;
};

export { configurePreRouteMiddleware };
