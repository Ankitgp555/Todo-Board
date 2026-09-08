"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import type { Task, TaskApiError, TaskStatus } from "@/types/task";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/tasks");

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setError("Unable to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  async function handleStatusChange(
    taskId: number,
    status: TaskStatus
  ) {
    try {
      setUpdatingTaskId(taskId);
      setUpdateError("");

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data: Task | TaskApiError = await response.json();

      if (!response.ok) {
        throw new Error(
          "error" in data ? data.error : "Failed to update task"
        );
      }

        if ("error" in data) {
            throw new Error(data.error);
        }

        const updatedTask = data;

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);

      setUpdateError(
        error instanceof Error
          ? error.message
          : "Unable to update task. Please try again."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  function handleTaskCreated(task: Task) {
    setTasks((currentTasks) => [task, ...currentTasks]);
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Task Board
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Manage your tasks and keep track of their progress.
        </p>
      </header>

      <TaskForm onTaskCreated={handleTaskCreated} />

      <section>
        {isLoading && (
          <p className="text-sm text-gray-500">
            Loading tasks...
          </p>
        )}

        {!isLoading && error && (
          <p
            className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {!isLoading && !error && updateError && (
          <p
            className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {updateError}
          </p>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          <p className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            No tasks yet. Add your first task above.
          </p>
        )}

        {!isLoading && !error && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                isUpdating={updatingTaskId === task.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}