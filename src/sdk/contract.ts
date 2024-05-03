import { initContract } from "@ts-rest/core";
import { TodoSchema } from "../schemas/Todo";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
  todos: {
    create: {
      method: "POST",
      path: "/todos",
      summary: "Create a todo",
      responses: {
        201: TodoSchema,
      },
      body: TodoSchema.omit({ id: true }),
    },
    getAll: {
      method: "GET",
      path: "/todos",
      summary: "Gets a list of todos",
      responses: {
        200: TodoSchema.array(),
      },
    },
    getOne: {
      method: "GET",
      path: "/todos/:id",
      summary: "Gets details of a single todo",
      responses: {
        200: TodoSchema,
      },
    },
    update: {
      method: "PATCH",
      path: "/todos/:id",
      body: TodoSchema.partial(),
      responses: {
        200: TodoSchema,
      },
    },
    delete: {
      method: "DELETE",
      path: "/todos/:id",
      body: z.null(),
      responses: {
        200: z.any(),
      },
    },
  },
});
