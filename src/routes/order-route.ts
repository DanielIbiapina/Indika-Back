import { Router } from "express";
import { OrderController } from "../controllers/order-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const orderController = new OrderController();

// Todas as rotas de pedidos precisam de autenticação
router.use(authMiddleware);

router.get("/", orderController.list);
router.post("/", orderController.create);
//router.get("/:id", orderController.show);
//router.put("/:id", orderController.update);
router.put("/:id/status", orderController.updateStatus);
//router.delete("/:id", orderController.cancel);

export { router as orderRouter };
