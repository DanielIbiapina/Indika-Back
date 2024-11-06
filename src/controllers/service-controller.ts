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

  public show = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const service = await this.serviceService.findById(id);

      if (!service) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      return res.json(service);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Do middleware de autenticação

      await this.serviceService.delete({
        serviceId: id,
        userId,
      });

      return res.status(204).send();
    } catch (error) {
      if (error.message === "Serviço não encontrado") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Sem permissão para deletar este serviço") {
        return res.status(403).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  public getMyServices = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const services = await this.serviceService.getServicesByProvider({
        providerId: userId,
        page: Number(page),
        limit: Number(limit),
        status: status as string,
      });

      return res.json(services);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // ... outros métodos do controller
}
