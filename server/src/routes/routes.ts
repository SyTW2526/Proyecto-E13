import { Router } from "express";
import authRouter from "./authRoutes";
import notificationsRouter from "./notificationsRoutes";
import usersRouter from "./usersRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/notifications", notificationsRouter);

export default router;
