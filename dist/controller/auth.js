"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signupController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("@/utils/logger"));
const User_1 = __importDefault(require("@/db/schema/User"));
const AppError_1 = require("@/utils/AppError");
const validationSchema_1 = require("@/utils/validationSchema");
const config_1 = __importDefault(require("@/config"));
const signupController = async (req, res, next) => {
    const exisitngUser = await User_1.default.findOne({ where: { email: "" } });
    try {
        const validatedData = validationSchema_1.registerSchema.parse(req.body);
        if (exisitngUser) {
            logger_1.default.error("User Alreaddy exits");
            throw new AppError_1.AppError("User already exits", 403);
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashPassword = await bcrypt_1.default.hash(validatedData.password, salt);
        const newUser = await User_1.default.create({
            email: validatedData.email,
            password: hashPassword,
            username: validatedData.username,
        });
        const accessToken = jsonwebtoken_1.default.sign({ userId: newUser.id, role: newUser.role }, config_1.default.accessTokenSecret, { expiresIn: config_1.default.accessTokenExpiry });
        await newUser.save();
        logger_1.default.silly("User created Successfully");
        res.status(200).json({ accessToken, newUser });
    }
    catch (error) {
        next(error);
    }
};
exports.signupController = signupController;
const loginController = async (req, res, next) => {
    try {
        const validatedData = validationSchema_1.loginSchema.parse(req.body);
        const user = await User_1.default.findOne({ where: { email: validatedData.email } });
        if (!user) {
            logger_1.default.error("User does not exits");
            throw new AppError_1.AppError("User does not exits", 403);
        }
        const isPasswordValid = await bcrypt_1.default.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, config_1.default.accessTokenSecret, { expiresIn: config_1.default.accessTokenExpiry });
        res.status(200).json({
            message: "Login successful",
            session: {
                accessToken: accessToken,
            },
            user: { email: user.email, username: user.username },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginController = loginController;
//# sourceMappingURL=auth.js.map