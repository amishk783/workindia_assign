import jwt, { decode, JwtPayload } from "jsonwebtoken";
import config from "@/config";
import { Response, NextFunction } from "express";
import Logger from "@/utils/logger";
import { AuthenticatedRequest, CustomJwtPayload } from "@/types";
import { AppError } from "@/utils/AppError";
import User from "@/db/schema/User";
import ApiKey from "@/db/schema/ApiKey";

export const verifyUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    Logger.error("Unauthorized: No token provided");
    throw new AppError("Access denied", 400);
  }

  jwt.verify(
    token,
    config.accessTokenSecret,

    (
      error: jwt.VerifyErrors | null,
      decoded: jwt.JwtPayload | string | undefined
    ) => {
      if (error) {
        Logger.error("Invalid token");
        throw new AppError(
          "Your session has expired. Please log in again",
          401
        );
      }

      const user = decoded as CustomJwtPayload;
      req.user = user;

      Logger.silly("User authenticated successfully");
      next();
    }
  );
};

// Middleware to verify user's role
export const verifyRole = (allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;

    // Validate the user object from the token
    if (!user) {
      Logger.error("JWT token has been tampered with or is invalid");
      throw new AppError("Invalid token. Please log in again.", 400);
    }
    // Fetch the user from the database
    const userDB = await User.findByPk(user.userId);

    if (!userDB) {
      Logger.error("User not found in the database");
      throw new AppError("User does not exist. Please register again.", 404);
    }
    // Verify if the role matches the token
    if (userDB.role !== user.role) {
      Logger.error("JWT role mismatch detected");
      throw new AppError(
        "Token has been tampered with. Please log in again.",
        400
      );
    }

    // Perform API key validation only if the user is an admin
    if (user.role === "admin") {
      const apiKey = req.headers["x-api-key"] as string;

      if (!apiKey) {
        Logger.error("Missing API key in request headers.");
        throw new AppError("Access denied. Missing API key.", 401);
      }

      const dbApiKey = await ApiKey.findOne({ where: { user_id: userDB.id } });
      if (!dbApiKey) {
        Logger.error("API key for the admin is not found in the database.");
        throw new AppError("Access denied. Missing database API key.", 401);
      }

      if (apiKey !== dbApiKey.key) {
        Logger.error("Invalid or tampered API key.");
        throw new AppError("Access denied. Invalid API key.", 401);
      }
    }

    // Check if the user's role is authorized
    if (!allowedRoles.includes(user.role)) {
      Logger.error(`Forbidden: Insufficient permissions for ${user?.role}`);
      throw new AppError(
        "You do not have permission to access this resource",
        403
      );
    }

    Logger.silly("User role validated");
    next();
  };
};
