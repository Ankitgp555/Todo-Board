# Todo Task Board

A small full-stack task board application built as part of the Full Stack Developer Intern practical assessment.

## Features

- View all tasks
- Create a new task with a title and status
- Update task status
- Supported statuses:
  - todo
  - in-progress
  - done
- Server-side input validation
- Loading, empty, and error states
- MySQL database persistence
- Parameterized SQL queries
- TypeScript types shared between frontend and backend

## Tech Stack

- Next.js
- React
- TypeScript
- Node.js
- MySQL
- mysql2

## Architecture

This project uses a single Next.js application.

The frontend is built using the Next.js App Router and React.

The backend uses Next.js API Route Handlers instead of a separate Express server. This keeps the application simple because the project is small and the frontend and backend can be maintained in one repository and application.

MySQL is used for persistent task storage, with `mysql2` handling the database connection.

## Why Next.js API Routes?

I chose Next.js API Route Handlers instead of creating a separate Express server because this is a small application with a limited API surface.

Using Route Handlers keeps the frontend and backend in one application and avoids unnecessary server and project setup while still providing a clear API boundary.

## Project Structure

```text
app/
  api/
    tasks/
      route.ts
      [id]/
        route.ts
  page.tsx
  layout.tsx
  globals.css

components/
  TaskBoard.tsx
  TaskForm.tsx
  TaskItem.tsx

lib/
  db.ts

types/
  task.ts

database/
  schema.sql

.env.example
.gitignore
README.md
package.json
tsconfig.json