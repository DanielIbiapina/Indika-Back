import { Router } from "express";
import { ServiceController } from "../controllers/service-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const serviceController = new ServiceController();

// Rotas públicas
router.get("/", serviceController.list);
router.get("/search", serviceController.search);
//router.get("/categories", serviceController.listCategories);
//router.get("/:id", serviceController.show);

// Rotas protegidas
router.use(authMiddleware);
router.post("/", serviceController.create);
//router.put("/:id", serviceController.update);
//router.delete("/:id", serviceController.delete);

export { router as serviceRouter };
