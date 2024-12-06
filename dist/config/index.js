"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envFound = dotenv_1.default.config();
if (envFound.error) {
    throw new Error("Couldn't find .env file");
}
const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000") || 3000,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "",
    databaseURL: process.env.DATABASE_NAME || "",
    dbHost: process.env.DB_HOST || "",
    dbUser: process.env.DB_USER || "",
    dbName: process.env.DB_NAME || "",
    dbPassword: process.env.DB_PASSWORD || "",
    apiBasePath: process.env.API_BASE_PATH || "/api",
    jwtSecret: process.env.JWT_SECRET || "",
    logs: {
        level: process.env.LOG_LEVEL || "silly",
    },
};
exports.default = config;
//# sourceMappingURL=index.js.map