import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  userId: z.string(),
});

export type CreateWorkspaceDTO =
  z.infer<typeof createWorkspaceSchema>;


export const updateWorkspaceSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
});

export type UpdateWorkspaceDTO =
  z.infer<typeof updateWorkspaceSchema>;