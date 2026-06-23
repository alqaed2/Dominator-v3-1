import { PrismaClient } from "@prisma/client";

// Prevent multiple prisma instances in hot-reloading development scenarios
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["warn", "error"],
    errorFormat: "minimal"
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
