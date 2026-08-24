import { z } from "zod";

export const createDocumentSchema = z.object({
  body: z.object({
    workspaceId: z.string().cuid(),
  }),
});

export type CreateDocumentDto =
    z.infer<typeof createDocumentSchema>["body"]

export const updateDocumentSchema = z.object({
  body: z.object({
    processingStatus: z
      .enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"])
      .optional(),

    extractedText: z
      .string()
      .optional(),
  }),

  params: z.object({
    id: z.string().cuid(),
  }),
});

export type UpdateDocumentDTO =
    z.infer<typeof updateDocumentSchema>["body"]

