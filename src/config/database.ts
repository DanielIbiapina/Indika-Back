import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDb() {
  try {
    await prisma.$connect();
    console.log("Conectado ao banco de dados");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
}
