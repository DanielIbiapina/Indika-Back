import { PrismaClient } from "@prisma/client";

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Usado por AuthService e UserService
  public async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            providedServices: true,
            communities: true,
            receivedReviews: true,
          },
        },
      },
    });
  }

  // Usado principalmente por AuthService
  public async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Usado por AuthService (registro)
  public async create(data: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        rating: 0,
        isServiceProvider: false,
      },
    });
  }

  // Usado por UserService (atualização de perfil) e AuthService (reset de senha)
  public async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            providedServices: true,
            communities: true,
            receivedReviews: true,
          },
        },
      },
    });
  }

  // Usado por AuthService (reset de senha)
  public async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }
}
