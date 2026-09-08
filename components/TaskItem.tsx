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
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-medium text-gray-900">{task.title}</h2>

        <select
          value={task.status}
          disabled={isUpdating}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 disabled:bg-gray-100"
          aria-label={`Status for ${task.title}`}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {isUpdating && (
        <p className="mt-2 text-xs text-gray-500">
          Updating...
        </p>
      )}
    </article>
  );
}