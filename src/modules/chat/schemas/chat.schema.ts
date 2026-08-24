import { z } from "zod";

export const createChatSchema = z.object({
    workspaceId: z.string().min(1, "El workspaceId es obligatorio"),
    title: z.string().min(1, "El título es obligatorio").optional(),
});


export const updateChatSchema = z.object({
    title: z.string().min(1, "El título es obligatorio").optional(),
});


export const createMessageSchema = z.object({
    role: z.enum([
        "user",
        "assistant"
    ]),
    content: z.string().min(1, "El contenido es obligatorio"),
    tokens: z.number().int().positive().optional(),
    model: z.string().optional(),
});