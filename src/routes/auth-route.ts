import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const authController = new AuthController();

// Rotas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);
//router.post("/forgot-password", authController.forgotPassword);
//router.post("/reset-password", authController.resetPassword);

// Rotas protegidas
router.use(authMiddleware);
//router.post("/logout", authController.logout);
//router.post("/refresh-token", authController.refreshToken);

export { router as authRouter };
