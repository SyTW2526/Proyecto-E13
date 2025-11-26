import { Router } from "express";
import authRouter from "./authRoutes";
import usersRouter from "./usersRoutes";
import tasksRouter from "./tasksRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);

export default router;
