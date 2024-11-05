import { OrderRepository } from "../repositories/order-repository";
import { ServiceRepository } from "../repositories/service-repository";

export class OrderService {
  private orderRepository: OrderRepository;
  private serviceRepository: ServiceRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.serviceRepository = new ServiceRepository();
  }

  public async create(data: {
    serviceId: string;
    clientId: string;
    scheduledDate: Date;
    description: string;
  }) {
    const service = await this.serviceRepository.findById(data.serviceId);
    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    if (service.providerId === data.clientId) {
      throw new Error("Você não pode fazer um pedido para seu próprio serviço");
    }

    return this.orderRepository.create({
      ...data,
      providerId: service.providerId,
      status: "pending",
      price: service.priceStartingAt,
    });
  }

  public async list(params: {
    userId: string;
    status?: string;
    role: "client" | "provider";
  }) {
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.role === "client") {
      where.clientId = params.userId;
    } else {
      where.providerId = params.userId;
    }

    return this.orderRepository.findMany({ where });
  }

  public async updateStatus(params: {
    orderId: string;
    status: string;
    userId: string;
  }) {
    const order = await this.orderRepository.findById(params.orderId);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (order.providerId !== params.userId) {
      throw new Error("Apenas o prestador pode atualizar o status do pedido");
    }

    // Validar transições de status permitidas
    const allowedTransitions = {
      pending: ["accepted", "cancelled"],
      accepted: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    if (!allowedTransitions[order.status].includes(params.status)) {
      throw new Error("Transição de status não permitida");
    }

    return this.orderRepository.update(params.orderId, {
      status: params.status,
    });
  }

  // ... outros métodos do service
}
