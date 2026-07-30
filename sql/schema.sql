-- Run this once in MySQL Workbench, phpMyAdmin, or the mysql CLI
-- to create the database and the users table.

CREATE DATABASE IF NOT EXISTS school_website;
USE school_website;

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('student', 'parent') NOT NULL DEFAULT 'student',
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);