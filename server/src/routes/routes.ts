import { Router } from "express";
import authRouter from "./authRoutes";
import usersRouter from "./usersRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);

export default router;
