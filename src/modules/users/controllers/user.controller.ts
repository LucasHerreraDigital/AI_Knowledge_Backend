import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { UserService } from "../services/user.service.js";

export class UserController {
  private readonly service = new UserService();

  getUsers = asyncHandler(async (_req, res) => {
    const users = await this.service.getUsers();

    return res.status(200).json(users);
  });

  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };

    const user = await this.service.getUserById(id);

    return res.status(200).json(user);
  });

  getUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params as {email: string} ;

    const user = await this.service.getUserByEmail(email);

    return res.status(200).json(user);
  });

  updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };

  const user = await this.service.updatedUser(id, req.body);

  return res.status(200).json(user);
});

}