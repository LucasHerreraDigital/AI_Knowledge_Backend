import { z } from "zod";

export const createChatSchema = z.object({
    title: z.string().trim().min(1,"El título es obligatorio"),
}).strict();


export const updateChatSchema = z.object({
    title: z.string().trim().min(1, "El título es obligatorio"),
}).strict();


export const createMessageSchema = z.object({
    content: z.string().trim().min(1,"El contenido es obligatorio"),
}).strict();