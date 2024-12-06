import dotenv from "dotenv";
const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

interface ServerConfig {
  nodeEnv: string;
  port: number;
  databaseURL: string;
  jwtSecret: string;
  dbName: string;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  accessTokenSecret: string;
  apiBasePath: string;
  accessTokenExpiry: string;

  logs: { level: string };
}

const config: ServerConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000") || 3000,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1h",
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
export default config;
