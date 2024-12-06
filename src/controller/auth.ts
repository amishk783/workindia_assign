import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import Logger from "@/utils/logger";
import User from "@/db/schema/User";
import { AppError } from "@/utils/AppError";
import { loginSchema, registerSchema } from "@/utils/validationSchema";
import config from "@/config";

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

    const user = {
      email: newUser.email,
      accessToken,
      role: newUser.role,
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
      throw new AppError("User does not exits", 403);
    }
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
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
