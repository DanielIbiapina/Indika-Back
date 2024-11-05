import { PrismaClient } from "@prisma/client";

export class ReviewRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async create(data: any) {
    return this.prisma.review.create({
      data,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reviewed: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  public async findByOrderId(orderId: string) {
    return this.prisma.review.findUnique({
      where: { orderId },
    });
  }

  public async findByService(serviceId: string) {
    return this.prisma.review.findMany({
      where: { serviceId },
    });
  }

  public async findByReviewed(reviewedId: string) {
    return this.prisma.review.findMany({
      where: { reviewedId },
    });
  }

  public async findMany(params: { where: any; skip?: number; take?: number }) {
    return this.prisma.review.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reviewed: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
