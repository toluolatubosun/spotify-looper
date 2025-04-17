import response from "@/utilities/response";
import CustomError from "@/utilities/custom-error";
import { Express, NextFunction, Request, Response } from "express";

const configureErrorMiddleware = (app: Express): Express => {
    // Handle 404 requests
    app.use("*", (_req: Request, res: Response) => {
        res.status(404).render("404", { title: "Page not found" });
    });

    // Handle errors middleware
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(error.name, "====", error.message);
        console.error(error);

        let statusCode = 500;
        let message = String(error.message);
        const isApiRequest = req.url.includes("/api");

        switch (error.name) {
            case "CustomError": {
                statusCode = (error as CustomError).status || 500;

                break;
            }

            case "TokenExpiredError":
            case "JsonWebTokenError": {
                statusCode = 401;
                message = "Authentication token expired";
                res.clearCookie("access_token");

                break;
            }

            case "WebapiError": {
                statusCode = 500;
                message = "Send an email to toluolatubosun@gmail.com to gain access to the platform";
                res.clearCookie("access_token");

                break;
            }

            case "SyntaxError":
            case "ValidationError": {
                statusCode = 400;

                break;
            }

            default: {
                // Check if it's a Prisma error
                if (error.name.includes("PrismaClient")) {
                    statusCode = 500;
                    message = isApiRequest ? "Internal server error" : "Database Error";
                    res.clearCookie("access_token");
                }

                break;
            }
        }

        if (isApiRequest) {
            res.status(statusCode).send(response(message, null, false));
        } else {
            res.status(statusCode).render("error", { title: "Error", message });
        }

        next();
    });

    return app;
};

export { configureErrorMiddleware };
