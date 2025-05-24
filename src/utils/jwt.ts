import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_token";

export function signJWT(payload: { id: number; username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
