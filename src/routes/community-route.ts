import { Router } from "express";
import { CommunityController } from "../controllers/community-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
const communityController = new CommunityController();

// Rotas públicas
router.get("/", communityController.list);
router.get("/:id", communityController.show);
//router.get("/:id/members", communityController.listMembers);

// Rotas protegidas
router.use(authMiddleware);
router.post("/", communityController.create);
//router.put("/:id", communityController.update);
//router.delete("/:id", communityController.delete);
//router.post("/:id/join", communityController.join);
//router.post("/:id/leave", communityController.leave);
//router.post("/:id/invite", communityController.invite);

export { router as communityRouter };
