import { TodoTag } from "../../../types/TodoItem";

export const TodoItemTag = ({ tag }: { tag: TodoTag }) => {
  const tagColours = {
    [TodoTag.Health]: "bg-green-200/50 text-green-150", // Health: green
    [TodoTag.Home]: "bg-blue-200/50 text-blue-150", // Home: blue
    [TodoTag.Personal]: "bg-pink-200/50 text-pink-150", // Personal: pink
    [TodoTag.Work]: "bg-yellow-200/50 text-yellow-150", // Work: yellow
  };

  return (
    <div
      className={` px-2 ${tagColours[tag]} rounded-lg max-w-20 text-sm text-center`}
    >
      {tag.toString()}
    </div>
  );
};
