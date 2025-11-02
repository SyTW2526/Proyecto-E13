import { Router } from "express";
import {
  getUserById,
  deleteUser,
} from "../controllers/usersController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/:id", getUserById);
router.delete("/:id", authenticate, deleteUser);

export default router;
