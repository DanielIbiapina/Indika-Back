import { Request, Response } from "express";
import { ReviewService } from "../services/review-service";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  public create = async (req: Request, res: Response) => {
    try {
      const reviewerId = req.user.id;
      const { orderId, rating, comment } = req.body;

      const review = await this.reviewService.create({
        orderId,
        reviewerId,
        rating,
        comment,
      });

      return res.status(201).json(review);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public listByService = async (req: Request, res: Response) => {
    try {
      const { serviceId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const reviews = await this.reviewService.listByService({
        serviceId,
        page: Number(page),
        limit: Number(limit),
      });

      return res.json(reviews);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  public listByUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const reviews = await this.reviewService.listByUser({
        userId,
        page: Number(page),
        limit: Number(limit),
      });

      return res.json(reviews);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // ... outros métodos do controller
}
