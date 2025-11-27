import { Router } from "express";
import {
  createList,
  deleteList,
  getUserLists,
} from "../controllers/listsController";
import { authenticate } from "../middleware/authMiddleware";
import { createListSchema } from "../schemas/validationSchemas";
import { validateBody } from "../middleware/validationMiddleware";

const router = Router();

router.post("/", authenticate, validateBody(createListSchema), createList);
router.get("/", authenticate, getUserLists);
router.delete("/:id", authenticate, deleteList);

export default router;
