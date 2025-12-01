import type { TodoItem } from "../types/TodoItem";
import type { FilterOption } from "../components/ui/FilterBar";

/**
 * Checks if a date is today
 */
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Filters todos based on the selected filter option
 */
export const filterTodos = (
  todos: TodoItem[],
  filter: FilterOption
): TodoItem[] => {
  switch (filter) {
    case "all":
      return todos;
    case "dueToday":
      return todos.filter(
        (todo) => !todo.done && isToday(new Date(todo.dueDate))
      );
    case "completed":
      return todos.filter((todo) => todo.done);
    default:
      return todos;
  }
};

/**
 * Counts todos due today
 */
export const countTodosDueToday = (todos: TodoItem[]): number => {
  return todos.filter(
    (todo) => !todo.done && isToday(new Date(todo.dueDate))
  ).length;
};


