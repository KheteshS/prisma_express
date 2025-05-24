import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthenticatedReq } from "../middleware/auth";
import { todoSchema } from "../schemas/validation";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

router.use(authenticateToken);

router.post("/", async (req: AuthenticatedReq, res: any) => {
  try {
    const parsedReq = todoSchema.safeParse(req.body);

    if (parsedReq.success) {
      const { title, description, done } = parsedReq.data;

      const todo = await prisma.todo.create({
        data: {
          title: title,
          description: description,
          userId: req.user!.id,
        },
      });

      res.json({
        message: "Todo created Successfully!!",
        data: todo,
      });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: AuthenticatedReq, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user!.id },
    });
    if (todos.length <= 0) res.json("No todos available!!");
    else res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
