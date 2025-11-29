import { useState } from "react";
import type { TodoItem as TodoItemModel } from "../../../types/TodoItem";
import styles from ".././HomePage.module.css";

export const TodoItem = ({ item }: { item: TodoItemModel }) => {
  const [isDone, setIsDone] = useState(false);
  return (
    <div
      className={styles.todoContainer}
      onClick={() => {
        setIsDone((prev) => !prev);
      }}
    >
      <input className={styles.checkBox} type="checkbox" checked={isDone} />
      <div className={styles.todoDetails}>
        <div className={styles.todoName}>{item.name}</div>
        <div className={styles.todoDate}>
          Due Date: {item.dueDate.toDateString()}
        </div>
      </div>
    </div>
  );
};
