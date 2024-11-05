import { Request, Response } from "express";
import { CommunityService } from "../services/community-service";

export class CommunityController {
  private communityService: CommunityService;

  constructor() {
    this.communityService = new CommunityService();
  }

  public list = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, category } = req.query;
      const communities = await this.communityService.list({
        page: Number(page),
        limit: Number(limit),
        category: category as string,
      });
      return res.json(communities);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; // Do middleware de auth
      const community = await this.communityService.create({
        ...req.body,
        creatorId: userId,
      });
      return res.status(201).json(community);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public show = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const community = await this.communityService.findById(id);
      return res.json(community);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  };

  // ... outros métodos do controller
}
