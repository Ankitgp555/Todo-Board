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
  <main className="min-h-screen px-4 py-8 sm:px-6">
    <div className="mx-auto max-w-3xl space-y-5">
              <header>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                      Todo Task Board
                  </h1>

                  <p className=" ml-1 text-sm leading-6 text-slate-600">
                      Just Note The Task and Track It
                  </p>
              </header>

      <TaskForm onTaskCreated={handleTaskCreated} />

      <section>
        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Loading tasks...</p>
          </div>
        )}

        {!isLoading && error && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {!isLoading && !error && updateError && (
          <p
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            {updateError}
          </p>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-medium text-slate-800">No tasks yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first task above to get started.
            </p>
          </div>
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
    </div>
  </main>
);
}