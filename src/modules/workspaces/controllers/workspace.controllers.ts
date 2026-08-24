import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { WorkspaceService } from "../services/workspace.service.js";

export class WorkspaceController {
  private readonly service = new WorkspaceService();

  getWorkspaces = asyncHandler(async (_req, res) => {
    const workspaces = await this.service.getWorkspaces();

    return res.status(200).json(workspaces);
  });

  getWorkspaceByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params as { userId: string };

    const workspaces = await this.service.getWorkspaceByUser(userId);

    return res.status(200).json(workspaces);
  });

  getWorkspaceById = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };

    const workspace = await this.service.getWorkspaceById(id);

    return res.status(200).json(workspace);
  });

  createWorkspace = asyncHandler(async (req, res) => {
    const workspace = await this.service.createWorkspace(req.body);

    return res.status(201).json(workspace);
  });

  updateWorkspace = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };

    const workspace = await this.service.updateWorkspace(id, req.body);

    return res.status(200).json(workspace);
  });

  deleteWorkspace = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };

    await this.service.deleteWorkspace(id);

    return res.sendStatus(204);
  });
}