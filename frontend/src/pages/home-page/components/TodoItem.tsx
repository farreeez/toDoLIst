import type { TodoItem as TodoItemModel } from "../../../types/TodoItem";
import styles from ".././HomePage.module.css";

export const TodoItem = ({ item }: { item: TodoItemModel }) => {
  return (
    <div className={styles.todoContainer}>
      <input type="checkbox" />
      <div className={styles.todoDetails}>
        <div className={styles.todoName}>{item.name}</div>
        <div className={styles.todoDate}>
          Due Date: {item.dueDate.toDateString()}
        </div>
      </div>
    </div>
  );
};
