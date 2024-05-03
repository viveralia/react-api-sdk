import { Todo } from "../schemas/Todo";
import cn from "../utils/styles";

type Props = {
  todo: Todo;
  onDelete: (todo: Todo) => void;
  onCompleteToggle: (todo: Todo) => void;
};

export default function TodoItem({ todo, onCompleteToggle, onDelete }: Props) {
  const handleDelete = () => {
    onDelete(todo);
  };

  const handleCompleteToggle = () => {
    onCompleteToggle(todo);
  };

  return (
    <div className="flex items-center justify-between">
      <p className={cn(todo.isComplete && "line-through")}>{todo.title}</p>
      <div className="flex gap-1 items-center">
        <button onClick={handleCompleteToggle}>
          {todo.isComplete ? "Incomplete" : "Complete"}
        </button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
