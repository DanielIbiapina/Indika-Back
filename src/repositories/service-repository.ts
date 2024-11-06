import { PrismaClient } from "@prisma/client";

export class ServiceRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async create(data: any) {
    return this.prisma.service.create({
      data,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
      },
    });
  }

  public async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    return this.prisma.service.findMany({
      ...params,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  }

  public async search(params: { query: string; skip?: number; take?: number }) {
    return this.prisma.service.findMany({
      where: {
        OR: [
          { title: { contains: params.query, mode: "insensitive" } },
          { description: { contains: params.query, mode: "insensitive" } },
        ],
      },
      skip: params.skip,
      take: params.take,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
    });
  }

  public async updateProviderRating(providerId: string, rating: number) {
    return this.prisma.user.update({
      where: { id: providerId },
      data: { rating },
    });
  }

  public async findById(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            isServiceProvider: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Retorna apenas as 5 últimas avaliações
        },
        _count: {
          select: {
            reviews: true,
            orders: true,
          },
        },
      },
    });
  }

  public async hasActiveOrders(serviceId: string): Promise<boolean> {
    const activeOrders = await this.prisma.order.findFirst({
      where: {
        serviceId,
        status: {
          in: ["pending", "accepted", "in_progress"],
        },
      },
    });

    return !!activeOrders;
  }

  public async delete(id: string) {
    // Usando transação para garantir que todas as operações sejam realizadas ou nenhuma
    return this.prisma.$transaction(async (tx) => {
      // Primeiro, deleta todas as avaliações relacionadas
      await tx.review.deleteMany({
        where: { serviceId: id },
      });

      // Depois, deleta todos os pedidos concluídos ou cancelados
      await tx.order.deleteMany({
        where: {
          serviceId: id,
          status: {
            in: ["completed", "cancelled"],
          },
        },
      });

      // Por fim, deleta o serviço
      return tx.service.delete({
        where: { id },
      });
    });
  }

  public async findManyByProvider(params: {
    providerId: string;
    skip?: number;
    take?: number;
    status?: string;
  }) {
    const where: any = {
      providerId: params.providerId,
    };

    return this.prisma.service.findMany({
      where,
      skip: params.skip,
      take: params.take,
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
        orders: {
          select: {
            status: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ... outros métodos do repository
}
