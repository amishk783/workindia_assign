"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, req, res) => {
    // If the error is an instance of AppError, use its properties
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // For unknown errors (programmer errors)
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map