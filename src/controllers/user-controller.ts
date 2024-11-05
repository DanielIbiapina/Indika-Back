import { Request, Response } from "express";
import { UserService } from "../services/user-service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const profile = await this.userService.getProfile(userId);
      return res.json(profile);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { name, avatar, isServiceProvider } = req.body;

      const updatedProfile = await this.userService.updateProfile(userId, {
        name,
        avatar,
        isServiceProvider,
      });

      return res.json(updatedProfile);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public getMyOrders = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { status, role = "client", page = 1, limit = 10 } = req.query;

      const orders = await this.userService.getUserOrders({
        userId,
        status: status as string,
        role: role as "client" | "provider",
        page: Number(page),
        limit: Number(limit),
      });

      return res.json(orders);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // ... outros métodos do controller
}
