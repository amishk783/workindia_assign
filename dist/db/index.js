"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const config_1 = __importDefault(require("@/config"));
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize(config_1.default.dbName, config_1.default.dbUser, config_1.default.dbPassword, {
    dialect: "mysql",
    host: config_1.default.dbHost,
    logging: process.env.NODE_ENV === "production" ? false : console.log,
});
//# sourceMappingURL=index.js.map