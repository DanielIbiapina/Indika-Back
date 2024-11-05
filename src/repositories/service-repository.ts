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

  // ... outros métodos do repository
}
