import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import type { TaskStatus } from "@/types/task";

interface TaskRow extends RowDataPacket {
  id: number;
  title: string;
  status: TaskStatus;
  created_at: Date;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "todo" || value === "in-progress" || value === "done";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        { error: "Invalid task status" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [body.status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const [rows] = await pool.execute<TaskRow[]>(
      "SELECT id, title, status, created_at FROM tasks WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Task could not be retrieved after update" },
        { status: 500 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Failed to update task:", error);

    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}