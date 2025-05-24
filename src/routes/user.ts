import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signInSchema, signupSchema } from "../schemas/validation";
import { signJWT } from "../utils/jwt";

const prisma = new PrismaClient();
const router = Router();

// Sign In
router.post("/signin", async (req: any, res: any) => {
  try {
    const parsedRes = signInSchema.safeParse(req.body);
    if (parsedRes.success) {
      const { username, password } = parsedRes.data;
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password!!" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password!!" });
      }

      const token = signJWT({ id: user.id, username: user.username });
      res.json({
        message: "Sign In successful!",
        token: token,
      });
    } else {
      return res.status(401).json({ error: "Invalid email or password!!" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Sign Up
router.post("/signup", async (req: any, res: any) => {
  try {
    const parsedRes = signupSchema.safeParse(req.body);
    if (parsedRes.success) {
      const { username, password, firstname, lastname } = parsedRes.data;

      const hashedPass = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { ...parsedRes.data, password: hashedPass },
      });

      res.json({
        message: "User created !!",
        data: { userId: user.id, username: user.username },
      });
    } else {
      return res.status(401).json({ error: "Invalid inputs!!" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    if ((error as any).code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
