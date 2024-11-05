import { Router } from "express";
import { ReviewController } from "../controllers/review-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const reviewController = new ReviewController();

// Rotas públicas
router.get("/services/:serviceId", reviewController.listByService);
router.get("/users/:userId", reviewController.listByUser);
//router.get("/:id", reviewController.show);

// Rotas protegidas
router.use(authMiddleware);
router.post("/", reviewController.create);
//router.put("/:id", reviewController.update);
//router.delete("/:id", reviewController.delete);

export { router as reviewRouter };
