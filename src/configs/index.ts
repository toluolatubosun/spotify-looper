/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";
import packageInfo from "../../package.json";

dotenv.config();

// How to use this:
// ============================================================
// This file is used to store all the environment variables and constants used in the application.

// # To add a new variable:
// ============================================================
// - For environment variables & constants that are the same across all environments, add them to the GLOBAL_CONSTANTS object.
// - For environment-specific variables (i.e they change depending on the environemnt), add them to the environment's object in each of the CONFIG_BUILDER object.

// # To add a new environment:
// ============================================================
// 1. Add a new key to the CONFIG_BUILDER object with the environment name.
// 2. Duplicate the development object and replace the values with the new environment's values.

const APP_VERSION = packageInfo.version;
const DEPLOYMENT_ENV = process.env.NODE_ENV || "development";

const GLOBAL_CONSTANTS = {
    // System Constants
    // ============================================================
    APP_NAME: "looper",

    SPOTIFY: {
        CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
        CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
        REDIRECT_URI: "/v1/auth/spotify/callback",
    },
};

const CONFIG_BUILDER = {
    development: {
        ...GLOBAL_CONSTANTS,

        // System Constants
        // ============================================================
        URL: {
            APP_BASE_URL: "http://localhost:4000",
        },

        // Security / Auth Configs
        // ============================================================
        JWT_SECRET: "T4u2Rcnne09F.FBr11f0VvERyUiq",

        CORS_ALLOWED_ORIGINS: ["http://localhost:4000"],

        // e.g
        // STRIPE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },
    },

    production: {
        ...GLOBAL_CONSTANTS,

        // System Constants
        // ============================================================
        URL: {
            APP_BASE_URL: "https://looper.toluolatubosun.com",
        },

        // Security / Auth Configs
        // ============================================================
        JWT_SECRET: process.env.JWT_SECRET!,

        CORS_ALLOWED_ORIGINS: ["https://looper.toluolatubosun.com"],

        // e.g
        // STRIPE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },
    },
} as const;

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIGS = CONFIG_BUILDER[DEPLOYMENT_ENV as keyof typeof CONFIG_BUILDER];

// Uncomment below to check configs set
// console.log("CONFIGS:", CONFIGS);

export { DEPLOYMENT_ENV, APP_VERSION, CONFIGS };
