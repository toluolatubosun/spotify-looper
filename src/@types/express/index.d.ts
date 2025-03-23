import { Prisma } from "@prisma/client";

declare global {
    namespace Express {
        export interface Request {
            $user?: Omit<Prisma.UserGroupByOutputType, "_count" | "_min" | "_max">;
            $spotifyToken?: Omit<Prisma.SpotifyTokenGroupByOutputType, "_count" | "_min" | "_max">;
        }
    }
}
