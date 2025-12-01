export interface TodoItem {
  name: string;
  dueDate: Date;
  done: boolean;
  description: string;
  tag: TodoTag;
  priority: Priority;
}

export enum TodoTag {
  Work = "Work",
  Personal = "Personal",
  Home = "Home",
  Health = "Health",
}

export enum Priority {
  high = "high",
  medium = "medium",
  low = "low",
}
