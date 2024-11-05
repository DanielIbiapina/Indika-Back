import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const userController = new UserController();

// Rotas protegidas
router.use(authMiddleware);

// Rotas do perfil
router.get("/me", userController.getProfile);
router.put("/me", userController.updateProfile);
router.get("/me/orders", userController.getMyOrders);
//router.get("/me/communities", userController.getMyCommunities);
//router.get("/me/reviews", userController.getMyReviews);

// Rotas públicas (mas autenticadas)
//router.get("/:id", userController.show);
//router.get("/:id/services", userController.getUserServices);
//router.get("/:id/reviews", userController.getUserReviews);

export { router as userRouter };
