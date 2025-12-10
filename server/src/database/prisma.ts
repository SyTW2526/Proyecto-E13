import { PrismaClient } from "@prisma/client";

const global = globalThis as { prisma?: PrismaClient };

const prisma = global.prisma || (global.prisma = new PrismaClient());

export default prisma;
