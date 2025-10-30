import { Router } from "express";
import usersRouter from "./users";
import tasksRouter from "./tasks";

const router = Router();

// Montar routers por recurso: /api/users, /api/tasks
router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);

export default router;
