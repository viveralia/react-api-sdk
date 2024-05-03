import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { produce } from "immer";
import { TodoSchema } from "../schemas/Todo";
import cn from "../utils/styles";
import { sdk } from "../sdk";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = TodoSchema.omit({ id: true, isComplete: true });

export default function TodoForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const queryClient = useQueryClient();

  const createTodo = sdk.todos.create.useMutation({
    onMutate: (variables) => {
      sdk.todos.getAll.setQueryData(queryClient, ["todos"], (data) =>
        produce(data, (data) => {
          data?.body.push({
            id: crypto.randomUUID(),
            isComplete: false,
            title: variables.body.title,
          });
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"], exact: true });
    },
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    createTodo.mutate({ body: values });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input
        type="text"
        className={cn(
          "rounded p-2",
          form.formState.errors.title ? "border-red-600" : "border-slate-600"
        )}
        {...form.register("title")}
      />
      <button disabled={createTodo.isPending} type="submit">
        {createTodo.isPending ? "Adding todo..." : "Add todo"}
      </button>
    </form>
  );
}
