// set timezone
process.env.TZ = "Africa/Lagos";

import "express-async-errors";
import { createServer } from "http";
import express, { Express } from "express";

import routes from "@/routes";
import { configureErrorMiddleware } from "@/middlewares/error.middleware";
import { configurePreRouteMiddleware } from "@/middlewares/pre-route.middleware";

const app: Express = express();
const httpServer = createServer(app);

// Pre Route Middlewares
configurePreRouteMiddleware(app);

// Routes
app.use(routes);

// Error middlewares
configureErrorMiddleware(app);

const PORT: number | string = process.env.PORT || 4000;

// Listen to server port
httpServer.listen(PORT, async () => {
    console.log(`:::> Server listening on port ${PORT} @ http://localhost:${PORT} in ${String(process.env.NODE_ENV)} mode <:::`);
});

// On server error
app.on("error", (error) => {
    console.error(`<::: An error occurred on the server: \n ${error}`);
});

export default app;
