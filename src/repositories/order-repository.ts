import { PrismaClient } from "@prisma/client";

export class OrderRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async create(data: any) {
    return this.prisma.order.create({
      data,
      include: {
        service: {
          select: {
            title: true,
            description: true,
            images: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  public async findMany(params: { where: any }) {
    return this.prisma.order.findMany({
      where: params.where,
      include: {
        service: {
          select: {
            title: true,
            description: true,
            images: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        provider: {
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
    });
  }

  public async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        review: true,
      },
    });
  }

  public async update(id: string, data: any) {
    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }
}
