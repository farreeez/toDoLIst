import { useState } from "react";
import type { TodoItem as TodoItemModel } from "../../../types/TodoItem";
import { TodoItemTag } from "./TodoItemTag";

export const TodoItem = ({ item }: { item: TodoItemModel }) => {
  const [isDone, setIsDone] = useState(false);
  return (
    <div className="mb-2">
      <TodoItemTag tag={item.tag} />
    </div>
  );
};
