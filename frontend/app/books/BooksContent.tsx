"use client";

import React, { useEffect, useRef, useState } from "react"; // ✅ import React and hooks
import AddBookForm from "@/app/components/AddBookForm";
import BooksList from "@/app/components/BooksList";
import { Book } from "@/app/types/book";
import { Member } from "@/app/types/member";

type Props = {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
};

export default function BooksContent({ books, setBooks }: Props) {
  const [members, setMembers] = useState<Member[]>([]); // ✅ useState directly
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchBooks();
    fetchMembers();
  }, []);

  async function fetchBooks() {
    try {
      const res = await fetch("http://localhost:8000/books");
      const data: Book[] = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  }

  async function fetchMembers() {
    try {
      const res = await fetch("http://localhost:8000/members");
      const data: Member[] = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  }

  function handleBookDeleted(bookId: number) {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  }

  function handleBookAdded(newBook: Book) {
    setBooks((prev) => [newBook, ...prev]);
  }

  function handleBorrowSuccess(bookId: number) {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, copies_available: b.copies_available - 1 }
          : b,
      ),
    );
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6 text-white">Books</h1>

      <AddBookForm onAddSuccess={handleBookAdded} />

      <BooksList
        books={books}
        members={members}
        onDeleteSuccess={handleBookDeleted}
        onBorrowSuccess={handleBorrowSuccess}
      />
    </main>
  );
}
