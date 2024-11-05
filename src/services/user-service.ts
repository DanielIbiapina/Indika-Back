import { UserRepository } from "../repositories/user-repository";
import { OrderRepository } from "../repositories/order-repository";
import { CommunityRepository } from "../repositories/community-repository";
import { ReviewRepository } from "../repositories/review-repository";

export class UserService {
  private userRepository: UserRepository;
  private orderRepository: OrderRepository;
  private communityRepository: CommunityRepository;
  private reviewRepository: ReviewRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.orderRepository = new OrderRepository();
    this.communityRepository = new CommunityRepository();
    this.reviewRepository = new ReviewRepository();
  }

  public async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async updateProfile(
    userId: string,
    data: {
      name?: string;
      avatar?: string;
      isServiceProvider?: boolean;
    }
  ) {
    const updatedUser = await this.userRepository.update(userId, data);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  public async getUserOrders(params: {
    userId: string;
    status?: string;
    role: "client" | "provider";
    page: number;
    limit: number;
  }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.role === "client") {
      where.clientId = params.userId;
    } else {
      where.providerId = params.userId;
    }

    return this.orderRepository.findMany({
      where,
      skip,
      take: params.limit,
    });
  }

  public async getUserCommunities(params: {
    userId: string;
    page: number;
    limit: number;
  }) {
    const skip = (params.page - 1) * params.limit;
    return this.communityRepository.findManyByUser({
      userId: params.userId,
      skip,
      take: params.limit,
    });
  }

  public async getUserReviews(params: {
    userId: string;
    type: "given" | "received";
    page: number;
    limit: number;
  }) {
    const skip = (params.page - 1) * params.limit;
    const where =
      params.type === "given"
        ? { reviewerId: params.userId }
        : { reviewedId: params.userId };

    return this.reviewRepository.findMany({
      where,
      skip,
      take: params.limit,
    });
  }
}
