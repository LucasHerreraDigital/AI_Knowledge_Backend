import { prisma } from "../../../config/prisma.js";

export class SessionRepository {
  async create(userId: string, expiresAt: Date) {
    return prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
    });
  }

  async findById(id: string) {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  async revoke(id: string) {
    return prisma.session.updateMany({
      where: { id , revokedAt: null },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}