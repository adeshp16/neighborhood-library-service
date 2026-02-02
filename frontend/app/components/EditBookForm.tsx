"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "../types/book";

type Props = {
  book: Book;
  onCancel: () => void;
};

export default function EditBookForm({ book, onCancel }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [copies, setCopies] = useState(book.copies_available);
  const [isbn, setIsbn] = useState(book.isbn || "");
  const [publishedYear, setPublishedYear] = useState<number | "">(
    book.published_year || "",
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(`http://localhost:8000/books/${book.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        author,
        isbn: isbn || null,
        published_year: publishedYear || null,
        copies_available: copies,
      }),
    });

    setLoading(false);

    // Refresh Server component data
    router.refresh();
    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 shadow-sm space-y-3 w-full"
    >
      <h3 className="text-md font-semibold">Edit Book</h3>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Title</label>
        <input
          className="border rounded px-2 py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Author</label>
        <input
          className="border rounded px-2 py-1"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Copies Available</label>
        <input
          className="border rounded px-2 py-1"
          type="number"
          min={1}
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">ISBN</label>
        <input
          className="border rounded px-2 py-1"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Published Year</label>
        <input
          className="border rounded px-2 py-1"
          type="number"
          value={publishedYear}
          onChange={(e) =>
            setPublishedYear(e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
