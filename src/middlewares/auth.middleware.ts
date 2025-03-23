import JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { prisma } from "@/libraries/prisma";
import CustomError from "@/utilities/custom-error";
import { CONFIGS } from "@/configs";

const auth = async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.cookies.access_token) throw new CustomError("unauthorized", 401);

    const { access_token } = req.cookies;
    const { user_id } = JWT.verify(access_token, CONFIGS.JWT_SECRET) as { user_id: string };

    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) throw new CustomError("user not found", 404);

    const spotifyToken = await prisma.spotifyToken.findUnique({ where: { user_id } });
    if (!spotifyToken) throw new CustomError("Spotify token not found", 404);

    req.$user = user;
    req.$spotifyToken = spotifyToken;

    next();
};

export default auth;
