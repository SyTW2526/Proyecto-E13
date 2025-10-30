import { Router } from "express";
import {
  getTestUsers,
  getTestUserById,
  deleteTestUserById,
  deleteTestUsers,
  createTestUser,
} from "../controllers/users";

const router = Router();

router.post("/", createTestUser);
router.get("/", getTestUsers);
router.get("/:id", getTestUserById);
router.delete("/:id", deleteTestUserById);
router.delete("/", deleteTestUsers);

export default router;
