# Neighborhood Library Service – Take-Home Test

## Overview

A backend service for managing a neighborhood library’s books, members, and borrowing operations.
The system exposes REST APIs built with Python and FastAPI, persists data in PostgreSQL, and includes a minimal web frontend built with Next.js.

## Tech Stack

* Backend: Python, FastAPI
* Database: PostgreSQL
* ORM: SQLAlchemy
* Migrations: Alembic
* Frontend: React (Next.js)
* API Style: RESTs

## Features

* Create and update books
* Create and update members
* Borrow a book
* Return a borrowed book
* Query borrowed books by member
* List currently borrowed books