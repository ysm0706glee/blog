import { z } from "zod";

export const blogSchema = z.object({
  id: z.number(),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  created_at: z.string(),
});

export type Blog = z.infer<typeof blogSchema>;
