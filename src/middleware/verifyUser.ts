import jwt, { decode, JwtPayload } from "jsonwebtoken";
import config from "@/config";
import { Response, NextFunction } from "express";
import Logger from "@/utils/logger";
import { AuthenticatedRequest } from "@/types";
import { AppError } from "@/utils/AppError";

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
    config.jwtSecret,
    (
      error: jwt.VerifyErrors | null,
      decoded: jwt.JwtPayload | string | undefined
    ) => {
      if (error) {
        Logger.error("Invalid token");
        throw new AppError(
          "Your session has expired. Please log in again",
          403
        );
      }

      const user = decoded as JwtPayload;
      req.user = user;

      Logger.silly("User authenticated successfully");
      next();
    }
  );
};

// Middleware to verify user's role
export const verifyRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
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
