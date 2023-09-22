import { z } from "zod";

export const blogSchema = z.object({
  id: z.number(),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  picture: z.string().optional(),
  created_at: z.date(),
});

export type Blog = z.infer<typeof blogSchema>;
