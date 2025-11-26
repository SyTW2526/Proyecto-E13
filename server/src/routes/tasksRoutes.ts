import { Router } from "express";
import {
  createTask,
  getUserTasks,
  // getTaskById,
  // updateTask,
  deleteTask,
} from "../controllers/tasksController";
import { authenticate } from "../middleware/authMiddleware";
import { createTaskSchema } from "../schemas/validationSchemas";
import { validateBody } from "../middleware/validationMiddleware";

const router = Router();

router.post(
  "/",
  authenticate,
  validateBody(createTaskSchema),
  createTask,
);
router.get("/", authenticate, getUserTasks);
// router.get("/:id", getTaskById);
// router.patch("/:id", updateTask);
router.delete("/:id", authenticate, deleteTask);

export default router;
