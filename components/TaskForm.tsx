"use client";

import { useState } from "react";
import type { Task, TaskApiError, TaskStatus } from "@/types/task";

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          status,
        }),
      });

      const data: Task | TaskApiError = await response.json();

      if (!response.ok) {
        throw new Error(
          "error" in data ? data.error : "Failed to create task"
        );
      }

        if ("error" in data) {
            throw new Error(data.error);
        }

        onTaskCreated(data);

      setTitle("");
      setStatus("todo");
    } catch (error) {
      console.error("Failed to create task:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create task. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Task title
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a task"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as TaskStatus)
          }
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 disabled:bg-gray-100"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}