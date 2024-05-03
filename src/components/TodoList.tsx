import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { Todo } from "../schemas/Todo";
import { sdk } from "../sdk";
import TodoItem from "./TodoItem";

export default function Todolist() {
  const queryClient = useQueryClient();
  const todosQuery = sdk.todos.getAll.useQuery(["todos"]);
  const updateTodo = sdk.todos.update.useMutation({
    onMutate: (variables) => {
      sdk.todos.getAll.setQueryData(queryClient, ["todos"], (data) => {
        return produce(data, (data) => {
          const idToUpdate = variables.params.id;
          const itemIndex = data?.body.findIndex((i) => i.id === idToUpdate);
          data!.body[itemIndex!] = {
            ...data!.body[itemIndex!],
            ...variables.body,
          };
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"], exact: true });
    },
  });
  const deleteTodo = sdk.todos.delete.useMutation({
    onMutate: (variables) => {
      sdk.todos.getAll.setQueryData(queryClient, ["todos"], (data) => {
        return produce(data, (data) => {
          const idToDelete = variables.params.id;
          const itemIndex = data?.body.findIndex((i) => i.id === idToDelete);
          data?.body.splice(itemIndex!, 1);
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"], exact: true });
    },
  });

  if (todosQuery.isLoading) {
    return <p>Loading data...</p>;
  }

  if (todosQuery.error) {
    return <p>Something went wrong</p>;
  }

  if (!todosQuery.data?.body.length) {
    return <p>No todos yet. Try adding one.</p>;
  }

  const handleCompleteToggle = (todo: Todo) => {
    updateTodo.mutate({
      params: { id: todo.id },
      body: { isComplete: !todo.isComplete },
    });
  };

  const handleDelete = (todo: Todo) => {
    deleteTodo.mutate({ params: { id: todo.id }, body: null });
  };

  return (
    <ul>
      {todosQuery.data?.body.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onCompleteToggle={handleCompleteToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
