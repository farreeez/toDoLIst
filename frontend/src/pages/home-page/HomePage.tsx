import type { TodoItem as TodoItemType } from "../../types/TodoItem";
import { TodoItem } from "./components/TodoItem";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const todoItems: TodoItemType[] = [
    {
      name: "Buy groceries",
      dueDate: new Date("2023-10-27"),
      done: false,
    },
    {
      name: "Walk the dog",
      dueDate: new Date("2023-10-28"),
      done: true,
    },
    {
      name: "Finish project",
      dueDate: new Date("2023-11-01"),
      done: false,
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>To Do List!</div>
      <div className={styles.search}>
        <input type="text" placeholder="search" />
        <button className={styles.searchButton}>search</button>
      </div>

      <div className={styles.todoItemsContainer}>
        {todoItems.map((item, index) => (
          <TodoItem item={item} />
        ))}
      </div>
    </div>
  );
}
