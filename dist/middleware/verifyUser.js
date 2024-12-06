"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("@/config"));
const logger_1 = __importDefault(require("@/utils/logger"));
const AppError_1 = require("@/utils/AppError");
const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        logger_1.default.error('Unauthorized: No token provided');
        throw new AppError_1.AppError('Access denied', 400);
    }
    jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret, (error, decoded) => {
        if (error) {
            logger_1.default.error('Invalid token');
            throw new AppError_1.AppError('Your session has expired. Please log in again', 403);
        }
        req.user = decoded;
        logger_1.default.silly('User authenticated successfully');
        next();
    });
};
exports.verifyUser = verifyUser;
//# sourceMappingURL=verifyUser.js.map