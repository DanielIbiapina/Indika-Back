import { PrismaClient } from "@prisma/client";

export class CommunityRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async findMany(params: { skip?: number; take?: number; where?: any }) {
    return this.prisma.community.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }

  public async create(data: any) {
    return this.prisma.community.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  public async findById(id: string) {
    return this.prisma.community.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        admins: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  public async addMember(communityId: string, userId: string) {
    return this.prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  }

  // ... outros métodos do repository
}
