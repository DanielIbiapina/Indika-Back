import { ServiceRepository } from "../repositories/service-repository";

export class ServiceService {
  private serviceRepository: ServiceRepository;
  private readonly validCategories = [
    "tecnologia",
    "design",
    "marketing",
    "educação",
    // ... outras categorias
  ];

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  public async create(data: {
    title: string;
    description: string;
    category: string;
    priceStartingAt: number;
    priceUnit: string;
    images: string[];
    providerId: string;
  }) {
    if (!this.validCategories.includes(data.category)) {
      throw new Error("Categoria inválida");
    }

    if (data.priceStartingAt < 0) {
      throw new Error("O preço não pode ser negativo");
    }

    if (!["hora", "serviço", "pessoa"].includes(data.priceUnit)) {
      throw new Error("Unidade de preço inválida");
    }

    return this.serviceRepository.create({
      ...data,
      rating: 0,
    });
  }

  public async list(params: {
    page: number;
    limit: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    orderBy: string;
  }) {
    const skip = (params.page - 1) * params.limit;

    const where: any = {};

    if (params.category) {
      where.category = params.category;
    }

    if (params.minPrice || params.maxPrice) {
      where.priceStartingAt = {};
      if (params.minPrice) where.priceStartingAt.gte = params.minPrice;
      if (params.maxPrice) where.priceStartingAt.lte = params.maxPrice;
    }

    const orderBy: any = {};
    switch (params.orderBy) {
      case "price":
        orderBy.priceStartingAt = "asc";
        break;
      case "rating":
        orderBy.rating = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    return this.serviceRepository.findMany({
      skip,
      take: params.limit,
      where,
      orderBy,
    });
  }

  public async search(params: { query: string; page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;

    return this.serviceRepository.search({
      query: params.query,
      skip,
      take: params.limit,
    });
  }

  public listCategories() {
    return this.validCategories;
  }

  // ... outros métodos do service
}
