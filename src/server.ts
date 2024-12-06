import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import Logger from "./utils/logger";
import config from "./config";
import { errorHandler } from "./middleware/errorMiddleware";
import { sequelize } from "./db";
import { authRouter } from "./routes/auth";
import { trainRouter } from "./routes/train";

const app = express();

if (config.nodeEnv === "production") {
  app.use(helmet());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== "test") {
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
}

app.use("/", authRouter);
app.use("/", trainRouter);

app.use(errorHandler as express.ErrorRequestHandler);

sequelize.sync().then((result) => {
  app.listen(config.port, () => {
    Logger.info(
      `
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################`
    ).on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
  });
});
