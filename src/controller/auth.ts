import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Logger from "@/utils/logger";
import User from "@/db/schema/User";
import { AppError } from "@/utils/AppError";
import { loginSchema, registerSchema } from "@/utils/validationSchema";
import config from "@/config";
import ApiKey from "@/db/schema/ApiKey";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const exisitngUser = await User.findOne({ where: { email: "" } });

  try {
    const validatedData = registerSchema.parse(req.body);
    if (exisitngUser) {
      Logger.error("User Alreaddy exits");
      throw new AppError("User already exits", 403);
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(validatedData.password, salt);

    const newUser = await User.create({
      email: validatedData.email,
      password: hashPassword,
      username: validatedData.username,
      role: validatedData.role,
    });

    const accessToken = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      config.accessTokenSecret,

      { expiresIn: config.accessTokenExpiry }
    );

    await newUser.save();
    let apiKey;
    if (newUser.role === "admin") {
      const keySalt = await bcrypt.genSalt(10);

      apiKey = await ApiKey.create({
        user_id: newUser.id,
        key: keySalt,
      });

      await apiKey.save();
    }

    const user = {
      email: newUser.email,
      accessToken,
      role: newUser.role,
      ...(apiKey ? { apiKey: apiKey.key } : {}),
    };

    Logger.silly("User created Successfully");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ where: { email: validatedData.email } });

    if (!user) {
      Logger.error("User does not exits");
      throw new AppError("User does not exits", 400);
    }
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid Password", 400);
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      config.accessTokenSecret,
      { expiresIn: config.accessTokenExpiry }
    );

    res.status(200).json({
      message: "Login successful",
      session: {
        accessToken: accessToken,
      },
      user: { email: user.email, username: user.username },
    });
  } catch (error) {
    next(error);
  }
};
