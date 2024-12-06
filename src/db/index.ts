import config from "@/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    dialect: "mysql",
    host: config.dbHost,
    logging: process.env.NODE_ENV === "production" ? false : console.log,
  }
);
