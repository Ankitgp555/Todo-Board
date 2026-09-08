CREATE DATABASE IF NOT EXISTS todo_board;

USE todo_board;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('todo', 'in-progress', 'done') NOT NULL DEFAULT 'todo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, status)
VALUES
    ('Set up project structure', 'done'),
    ('Connect MySQL database', 'in-progress'),
    ('Build task board UI', 'todo');