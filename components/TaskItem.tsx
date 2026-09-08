"use client";

import type { Task, TaskStatus } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  isUpdating: boolean;
}

export default function TaskItem({
  task,
  onStatusChange,
  isUpdating,
}: TaskItemProps) {
  const statusLabel = {
    todo: "Todo",
    "in-progress": "In Progress",
    done: "Done",
  }[task.status];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-slate-900">
            {task.title}
          </h2>

          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              task.status === "done"
                ? "bg-green-100 text-green-700"
                : task.status === "in-progress"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="shrink-0">
          <label
            htmlFor={`status-${task.id}`}
            className="sr-only"
          >
            Status for {task.title}
          </label>

          <select
            id={`status-${task.id}`}
            value={task.status}
            disabled={isUpdating}
            onChange={(event) =>
              onStatusChange(
                task.id,
                event.target.value as TaskStatus
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-40"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {isUpdating && (
            <p className="mt-1 text-right text-xs text-slate-500">
              Updating...
            </p>
          )}
        </div>
      </div>
    </article>
  );
}