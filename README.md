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


## Borrowing Rules & Fine Policy

- **Borrowing period:** A book can be borrowed for **14 days** from the date of borrowing.
- **Overdue:** If the book is **not returned after the due date**, it is considered overdue.
- **Fine:** ₹5 per day for each day overdue.
- **Fine stops:** The fine calculation stops once the book is returned.
- **Implementation:** Fine is **derived dynamically** and **not stored** in the database (best practice).


### API Documentation
Full interactive API docs are available when the server is running:  
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)  
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)  

---

## API Endpoints Summary

### **Books**
| Method | Endpoint          | Description                       |
|--------|-----------------|-----------------------------------|
| GET    | /books           | List all books                     |
| POST   | /books           | Create a new book                  |
| GET    | /books/{id}      | Get a book by ID                   |
| PUT    | /books/{id}      | Update a book                      |

### **Members**
| Method | Endpoint          | Description                       |
|--------|-----------------|-----------------------------------|
| GET    | /members         | List all members                   |
| POST   | /members         | Create a new member                |
| GET    | /members/{id}    | Get a member by ID                 |
| PUT    | /members/{id}    | Update member details              |

### **Borrowings**
| Method | Endpoint                    | Description                             |
|--------|----------------------------|-----------------------------------------|
| GET    | /borrowings                | List all borrowings                     |
| POST   | /borrowings                | Borrow a book (creates a borrowing)    |
| PUT    | /borrowings/{id}/return    | Return a borrowed book (auto sets returned_at and increments book copies) |
| GET    | /borrowings/overdue        | List all overdue borrowings            |

---

## Notes
- `borrowed_at` and `returned_at` are timezone aware.
- `due_date` is set during borrowing creation.
- Fines are calculated automatically in the overdue API.
- For full request/response details, see the Swagger docs at `/docs`.


## Developer Setup

Follow these steps to set up the project locally:

---

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd neighborhood-library-service
```

---

### 2. Create a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate       # Windows
```

---

### 3. Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

> `requirements.txt` includes FastAPI, Uvicorn, SQLAlchemy, Psycopg2, Alembic, and other backend dependencies.

---

### 4. Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not installed).  
   - macOS: `brew install postgresql && brew services start postgresql`  
   - Ubuntu: `sudo apt install postgresql postgresql-contrib`  
   - Windows: Install from [PostgreSQL official site](https://www.postgresql.org/download/windows/)

2. **Create the database**:
```bash
psql -U postgres
CREATE DATABASE library_db;
\q
```

3. **Set environment variable for database connection**:
```bash
export DATABASE_URL=postgresql://<username>:<password>@localhost:5432/library_db   # macOS/Linux
set DATABASE_URL=postgresql://<username>:<password>@localhost:5432/library_db       # Windows CMD
$env:DATABASE_URL="postgresql://<username>:<password>@localhost:5432/library_db"    # Windows PowerShell
```

> Make sure to replace `<username>` and `<password>` with your PostgreSQL credentials.

---

### 5. Run Database Migrations

```bash
cd backend
alembic upgrade head
```

> We are controlling the database schema through **Alembic**, which is a migration tool for SQLAlchemy. Alembic tracks changes to the models and allows you to apply those changes incrementally to the database. It automatically generates migration scripts that create or modify tables, indexes, and constraints so that the database stays in sync with the application models. This ensures a consistent, version-controlled way to evolve the database schema without losing data.

> This step automatically creates all required tables (`books`, `members`, `borrowings`) and any future schema changes can also be applied via migrations.
---

### 6. Run the Backend Server

```bash
cd app
uvicorn main:app --reload
```

- FastAPI will run on `http://127.0.0.1:8000`
- Swagger docs available at `http://127.0.0.1:8000/docs`

---

✅ After these steps, the app is ready for development and testing.


