import { AppError } from "../../../shared/errors/AppError.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { WorkspaceService } from "../services/workspace.service.js";

export class WorkspaceController {
  private readonly service = new WorkspaceService();

  getWorkspaces = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No autenticado")
    }
    const userId = req.user.id
    const workspaces = await this.service.getWorkspaces(userId);

    return res.status(200).json(workspaces);
  });


  getWorkspaceById = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No autenticado")
    }
    const userId = req.user.id
    const { id } = req.params as { id: string };

    const workspace = await this.service.getWorkspaceById(id,userId);

    return res.status(200).json(workspace);
  });

  createWorkspace = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No autenticado")
    }
    const userId = req.user.id
    const workspace = await this.service.createWorkspace(req.body, userId);

    return res.status(201).json(workspace);
  });

  updateWorkspace = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No autenticado")
    }
    const userId = req.user.id
    const { id } = req.params as { id: string };

    const workspace = await this.service.updateWorkspace(id, req.body,userId);

    return res.status(200).json(workspace);
  });

  deleteWorkspace = asyncHandler(async (req, res) => {
    if(!req.user){
      throw new AppError(401,"No Autenticado")
    }
    const userId = req.user.id
    const { id } = req.params as { id: string };

    await this.service.deleteWorkspace(id,userId);

    return res.sendStatus(204);
  });
}