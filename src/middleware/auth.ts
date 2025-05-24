import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

export interface AuthenticatedReq extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export function authenticateToken(
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token missing" });
    return;
  }
  const decoded = verifyJWT(token);
  if (!decoded || typeof decoded !== "object") {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  req.user = {
    id: (decoded as any).id,
    username: (decoded as any).username,
  };
  next();
}
