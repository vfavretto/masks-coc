import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const Character = {
  findAll: async () => {
    return await prisma.character.findMany();
  },
  create: async (data: any) => {
    return await prisma.character.create({ data });
  },
};