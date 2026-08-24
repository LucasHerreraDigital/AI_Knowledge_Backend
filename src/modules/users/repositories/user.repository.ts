import { Prisma } from "../../../generated/prisma/client.js"
import { prisma } from "../../../config/prisma.js";

type CreateUserDTO = Prisma.UserUncheckedCreateInput;

type UpdateUserDTO = Prisma.UserUncheckedUpdateInput;

export class UserRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDTO) {
    return prisma.user.create({
      data,
    });
  }

  async update(
      id: string,
      data: UpdateUserDTO
  ) {
      return prisma.user.update({
          where: { id },
          data,
      });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}