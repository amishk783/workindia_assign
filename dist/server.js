"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const config_1 = __importDefault(require("./config"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const db_1 = require("./db");
const app = (0, express_1.default)();
if (config_1.default.nodeEnv === "production") {
    app.use((0, helmet_1.default)());
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (config_1.default.nodeEnv !== "test") {
    app.use((0, morgan_1.default)(config_1.default.nodeEnv === "production" ? "combined" : "dev"));
}
app.use(errorMiddleware_1.errorHandler);
db_1.sequelize.sync().then((result) => {
    app.listen(config_1.default.port, () => {
        logger_1.default.info(`
      ################################################
      🛡️  Server listening on port: ${config_1.default.port} 🛡️
      ################################################`).on("error", (err) => {
            logger_1.default.error(err);
            process.exit(1);
        });
    });
});
//# sourceMappingURL=server.js.map