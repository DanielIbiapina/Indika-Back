import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Criar usuários
    const password = await hash("123456", 10);

    const user1 = await prisma.user.create({
      data: {
        name: "João Silva",
        email: "joao@email.com",
        password,
        avatar: "https://ui-avatars.com/api/?name=Joao+Silva",
        isServiceProvider: true,
        rating: 4.5,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: "Maria Santos",
        email: "maria@email.com",
        password,
        avatar: "https://ui-avatars.com/api/?name=Maria+Santos",
        isServiceProvider: true,
        rating: 4.8,
      },
    });

    const user3 = await prisma.user.create({
      data: {
        name: "Pedro Costa",
        email: "pedro@email.com",
        password,
        avatar: "https://ui-avatars.com/api/?name=Pedro+Costa",
        isServiceProvider: false,
        rating: 0,
      },
    });

    // Criar comunidades
    await prisma.community.create({
      data: {
        name: "Desenvolvedores Web",
        description:
          "Comunidade para desenvolvedores web compartilharem conhecimento",
        image: "https://example.com/community1.jpg",
        categories: ["tecnologia", "programação"],
        isPrivate: false,
        creatorId: user1.id,
        members: {
          connect: [{ id: user1.id }, { id: user2.id }],
        },
        admins: {
          connect: [{ id: user1.id }],
        },
      },
    });

    await prisma.community.create({
      data: {
        name: "Designers Criativos",
        description: "Espaço para designers compartilharem trabalhos e dicas",
        image: "https://example.com/community2.jpg",
        categories: ["design", "criatividade"],
        isPrivate: false,
        creatorId: user2.id,
        members: {
          connect: [{ id: user2.id }, { id: user3.id }],
        },
        admins: {
          connect: [{ id: user2.id }],
        },
      },
    });

    // Criar serviços
    const service1 = await prisma.service.create({
      data: {
        title: "Desenvolvimento de Sites",
        description: "Criação de sites responsivos e modernos",
        category: "tecnologia",
        images: [
          "https://example.com/service1-1.jpg",
          "https://example.com/service1-2.jpg",
        ],
        rating: 4.5,
        priceStartingAt: 1000.0,
        priceUnit: "serviço",
        providerId: user1.id,
      },
    });

    const service2 = await prisma.service.create({
      data: {
        title: "Design de Logos",
        description: "Criação de logos profissionais e identidade visual",
        category: "design",
        images: ["https://example.com/service2-1.jpg"],
        rating: 4.8,
        priceStartingAt: 500.0,
        priceUnit: "serviço",
        providerId: user2.id,
      },
    });

    // Criar pedidos
    const order1 = await prisma.order.create({
      data: {
        status: "completed",
        price: 1000.0,
        scheduledDate: new Date("2024-03-20"),
        description: "Preciso de um site para minha loja",
        serviceId: service1.id,
        clientId: user3.id,
        providerId: user1.id,
      },
    });

    await prisma.order.create({
      data: {
        status: "in_progress",
        price: 500.0,
        scheduledDate: new Date("2024-03-25"),
        description: "Logo para minha startup",
        serviceId: service2.id,
        clientId: user1.id,
        providerId: user2.id,
      },
    });

    // Criar avaliações
    await prisma.review.create({
      data: {
        rating: 4.5,
        comment: "Excelente trabalho! Site ficou perfeito",
        orderId: order1.id,
        reviewerId: user3.id,
        reviewedId: user1.id,
        serviceId: service1.id,
      },
    });

    console.log("Seed executado com sucesso!");
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
