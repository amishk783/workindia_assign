import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}
export interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}
