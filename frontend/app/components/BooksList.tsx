"use client";

import { Book } from "@/app/types/book";
import { Member } from "@/app/types/member";
import { useState } from "react";
import EditBookForm from "./EditBookForm";
import BorrowBookForm from "./BorrowBookForm"; // ✅ Import new form

export default function BooksList({
  books,
  members, // ✅ pass members from parent
  onDeleteSuccess,
  onBorrowSuccess, // optional callback to update copies
}: {
  books: Book[];
  members: Member[];
  onDeleteSuccess: (bookId: number) => void;
  onBorrowSuccess?: (bookId: number) => void;
}) {
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  async function handleDelete(book: Book) {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/books/${book.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to delete the book");
        return;
      }

      onDeleteSuccess(book.id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong while deleting the book");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Books ({books.length})</h2>

      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="border rounded-lg p-4 shadow-sm">
            {editingBookId === book.id ? (
              <EditBookForm
                book={book}
                onCancel={() => setEditingBookId(null)}
              />
            ) : (
              <>
                <div className="font-semibold text-lg">{book.title}</div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Author:</span> {book.author}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">ISBN:</span>{" "}
                  {book.isbn ?? "N/A"}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Published Year:</span>{" "}
                  {book.published_year ?? "N/A"}
                </div>
                <div
                  className={`text-sm ${
                    book.copies_available > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Copies Available: {book.copies_available}
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingBookId(book.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(book)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  {/* ✅ Borrow form */}
                  {book.copies_available > 0 && members.length > 0 && (
                    <BorrowBookForm
                      bookId={book.id}
                      members={members}
                      onBorrowSuccess={() =>
                        onBorrowSuccess && onBorrowSuccess(book.id)
                      }
                    />
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
