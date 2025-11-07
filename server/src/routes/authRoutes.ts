import { Router } from "express";
import { login, register } from "../controllers/authController";
import { googleSignIn } from "../controllers/googleAuthController";

const router = Router();

// auth local
router.post("/login", login);
router.post("/register", register);

// auth con Google (ID token desde el cliente)
router.post("/google", googleSignIn);

export default router;
