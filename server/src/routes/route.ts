import { Router } from "express";
import {
  getTestUsers,
  getTestUserById,
  deleteTestUserById,
  deleteTestUsers,
  createTestUser,
} from "../controllers/controller";

const router = Router();

router.post("/users", createTestUser);
router.get("/users", getTestUsers);
router.get("/users/:id", getTestUserById);
router.delete("/users/:id", deleteTestUserById);
router.delete("/users", deleteTestUsers);

export default router;