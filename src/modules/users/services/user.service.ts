import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import bcrypt from "bcrypt";

export class UserService {
  private readonly repository = new UserRepository();

  async getUsers() {
    const users = await this.repository.findAll();
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async getUserById(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError(404, "No hay usuarios registrados con ese ID");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new AppError(404, "No hay usuarios registrados con ese email");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updatedUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
    },
  ) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError(404, "No hay un usuario con ese ID");
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await this.repository.findByEmail(data.email);

      if (emailExists) {
        throw new AppError(409, "Email ya registrado");
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.repository.update(id, data);

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }
}
