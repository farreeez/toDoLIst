import { useState } from "react";
import type { TodoItem as TodoItemModel } from "../../types/TodoItem";
import { Priority, TodoTag } from "../../types/TodoItem";
import styles from "./DashBoard.module.css";
import { MetricBox } from "./components/MetricBox";
import { TodoItem } from "./components/TodoItem";

export default function DashBoard() {
  const taskTabs = ["completed", "Due Today", "Completed"];
  const [activeTabIndex, setActiveTabIndex] = useState<0 | 1 | 2>(0);

  const todoItems: TodoItemModel[] = [
    {
      name: "Finish project report",
      dueDate: new Date(new Date().setHours(23, 59, 59, 999)),
      done: false,
      description:
        "Compile the final report for the quarterly project and send to manager.",
      tag: TodoTag.Work,
      priority: Priority.high,
    },
    {
      name: "Grocery shopping",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      done: false,
      description: "Buy ingredients for dinner and snacks for the week.",
      tag: TodoTag.Home,
      priority: Priority.medium,
    },
    {
      name: "Doctor's appointment",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      done: false,
      description: "Annual checkup at 10:00 AM.",
      tag: TodoTag.Health,
      priority: Priority.high,
    },
    {
      name: "Call mom",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      done: false,
      description: "Catch up with mom in the evening.",
      tag: TodoTag.Personal,
      priority: Priority.low,
    },
    {
      name: "Team meeting",
      dueDate: new Date(new Date().setHours(16, 0, 0, 0)),
      done: false,
      description: "Attend the sprint planning meeting on Zoom.",
      tag: TodoTag.Work,
      priority: Priority.medium,
    },
  ];

  const switchTabs = (index: number) => {
    if ([0, 1, 2].includes(index)) {
      setActiveTabIndex(index as 0 | 1 | 2);
    } else {
      console.error("active tab is invalid it is currently index " + index);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className="flex flex-row justify-between px-3 items-center">
        <div className={styles.headerText}>
          <div className="font-bold text-xl">Dashboard</div>
          <div className="text-gray-400">
            Welcome back! Here's your task overview.
          </div>
        </div>

        <button className="bg-green-400/70 text-black rounded-lg px-2 h-10 text-sm font-bold">
          + Add Task
        </button>
      </div>

      <div className="flex justify-between ">
        <MetricBox />
        <MetricBox />
        <MetricBox />
        <MetricBox />
      </div>

      <div className="flex bg-gray-800/70 rounded-md w-70 m-2 px-1.5 flex-row justify-between h-7 items-center">
        {taskTabs.map((task, index) => {
          return (
            <button
              key={index}
              onClick={() => switchTabs(index)}
              className={
                activeTabIndex == index
                  ? `text-sm bg-black rounded-lg h-6 px-2 hover:cursor-pointer`
                  : "text-sm px-2 hover:cursor-pointer"
              }
            >
              {task}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col">
        {todoItems.map((item, index) => (
          <TodoItem item={item} />
        ))}
      </div>
    </div>
  );
}
