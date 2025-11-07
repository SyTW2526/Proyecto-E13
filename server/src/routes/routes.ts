import { Router } from "express";
import authRouter from "./authRoutes";
import usersRouter from "./usersRoutes";
//import listsRouter from "./listsRoutes";
//import categoriesRouter from "./categoriesRoutes";
//import sharesRouter from "./sharesRoutes";
//import tasksRouter from "./tasksRoutes";

const router = Router();

// log de depuración para ver lo que entra
router.use((req, _res, next) => {
  // Ej: POST /auth/login
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

router.use("/auth", authRouter);
router.use("/users", usersRouter);
//router.use("/lists", listsRouter);
//router.use("/categories", categoriesRouter);
//router.use("/shares", sharesRouter);
//router.use("/tasks", tasksRouter);

export default router;
