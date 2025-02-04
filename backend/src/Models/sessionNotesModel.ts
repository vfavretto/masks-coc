import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SessionNote = {
  findAll: async () => {
    return await prisma.sessionNote.findMany();
  },
  create: async (data: any) => {
    return await prisma.sessionNote.create({ data });
  },
};