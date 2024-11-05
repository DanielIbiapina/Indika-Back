import { Request, Response } from "express";
import { ServiceService } from "../services/service-service";

export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  public list = async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        minPrice,
        maxPrice,
        orderBy = "createdAt",
      } = req.query;

      const services = await this.serviceService.list({
        page: Number(page),
        limit: Number(limit),
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        orderBy: orderBy as string,
      });

      return res.json(services);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public search = async (req: Request, res: Response) => {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      const services = await this.serviceService.search({
        query: q as string,
        page: Number(page),
        limit: Number(limit),
      });

      return res.json(services);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const providerId = req.user.id;
      const service = await this.serviceService.create({
        ...req.body,
        providerId,
      });

      return res.status(201).json(service);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // ... outros métodos do controller
}
