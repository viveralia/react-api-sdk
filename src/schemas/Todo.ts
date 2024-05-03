import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  isComplete: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema>;
