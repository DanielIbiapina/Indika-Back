import { Router } from "express";
import { ServiceController } from "../controllers/service-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const serviceController = new ServiceController();

// Rotas públicas (ordem importa!)
router.get("/search", serviceController.search);
//router.get("/categories", serviceController.listCategories);
router.get("/", serviceController.list);

// Rotas protegidas (ordem importa!)
router.use(authMiddleware);
router.get("/me", serviceController.getMyServices);
router.post("/", serviceController.create);

// Rota com parâmetro /:id (deve vir por último em cada grupo)
router.get("/:id", serviceController.show); // público
//router.put("/:id", serviceController.update); // protegido
router.delete("/:id", serviceController.delete); // protegido

export { router as serviceRouter };
