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

export async function GET() {
  try {
    const [rows] = await pool.execute<TaskRow[]>(
      "SELECT id, title, status, created_at FROM tasks ORDER BY created_at DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        { error: "Invalid task status" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO tasks (title, status) VALUES (?, ?)",
      [title, body.status]
    );

    const [rows] = await pool.execute<TaskRow[]>(
      "SELECT id, title, status, created_at FROM tasks WHERE id = ?",
      [result.insertId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Task was created but could not be retrieved" },
        { status: 500 }
      );
    }

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}