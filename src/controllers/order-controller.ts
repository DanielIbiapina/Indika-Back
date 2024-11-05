import { Request, Response } from "express";
import { OrderService } from "../services/order-service";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public list = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { status, role = "client" } = req.query;

      const orders = await this.orderService.list({
        userId,
        status: status as string,
        role: role as "client" | "provider",
      });

      return res.json(orders);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const clientId = req.user.id;
      const order = await this.orderService.create({
        ...req.body,
        clientId,
      });
      return res.status(201).json(order);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      const order = await this.orderService.updateStatus({
        orderId: id,
        status,
        userId,
      });

      return res.json(order);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // ... outros métodos do controller
}
