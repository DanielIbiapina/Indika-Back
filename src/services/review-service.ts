import { ReviewRepository } from "../repositories/review-repository";
import { OrderRepository } from "../repositories/order-repository";
import { ServiceRepository } from "../repositories/service-repository";

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private orderRepository: OrderRepository;
  private serviceRepository: ServiceRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.orderRepository = new OrderRepository();
    this.serviceRepository = new ServiceRepository();
  }

  public async create(data: {
    orderId: string;
    reviewerId: string;
    rating: number;
    comment: string;
  }) {
    // Validar se o pedido existe e está completo
    const order = await this.orderRepository.findById(data.orderId);
    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (order.status !== "completed") {
      throw new Error("Só é possível avaliar pedidos concluídos");
    }

    if (order.clientId !== data.reviewerId) {
      throw new Error("Apenas o cliente pode avaliar o pedido");
    }

    // Verificar se já existe avaliação
    const existingReview = await this.reviewRepository.findByOrderId(
      data.orderId
    );
    if (existingReview) {
      throw new Error("Este pedido já foi avaliado");
    }

    // Criar avaliação
    const review = await this.reviewRepository.create({
      ...data,
      reviewedId: order.providerId,
      serviceId: order.serviceId,
    });

    // Atualizar média do serviço
    await this.updateServiceRating(order.serviceId);
    // Atualizar média do prestador
    await this.updateProviderRating(order.providerId);

    return review;
  }

  private async updateServiceRating(serviceId: string) {
    const reviews = await this.reviewRepository.findByService(serviceId);
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await this.serviceRepository.update(serviceId, {
      rating: averageRating,
    });
  }

  private async updateProviderRating(providerId: string) {
    const reviews = await this.reviewRepository.findByReviewed(providerId);
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await this.serviceRepository.updateProviderRating(
      providerId,
      averageRating
    );
  }

  public async listByService(params: {
    serviceId: string;
    page: number;
    limit: number;
  }) {
    const skip = (params.page - 1) * params.limit;
    return this.reviewRepository.findMany({
      where: { serviceId: params.serviceId },
      skip,
      take: params.limit,
    });
  }

  // ... outros métodos do service
}
