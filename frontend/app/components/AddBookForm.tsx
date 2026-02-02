"use client";

import { useState } from "react";
import { Book } from "@/app/types/book";

type Props = {
  onAddSuccess: (book: Book) => void;
};

export default function AddBookForm({ onAddSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState(1);
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://localhost:8000/books", {
      method: "POST",
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

    if (!res.ok) {
      alert("Failed to add book");
      setLoading(false);
      return;
    }

    // ✅ backend should return created book
    const newBook: Book = await res.json();

    // reset form
    setTitle("");
    setAuthor("");
    setCopies(1);
    setIsbn("");
    setPublishedYear("");
    setLoading(false);

    // ✅ update UI immediately
    onAddSuccess(newBook);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-6 shadow-sm space-y-4 max-w-md"
    >
      <h3 className="text-lg font-semibold">Add New Book</h3>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Title</label>
        <input
          className="border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Author</label>
        <input
          className="border rounded px-3 py-2"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Copies Available</label>
        <input
          className="border rounded px-3 py-2"
          type="number"
          min={1}
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">ISBN</label>
        <input
          className="border rounded px-3 py-2"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Published Year</label>
        <input
          className="border rounded px-3 py-2"
          type="number"
          placeholder="Published Year"
          value={publishedYear}
          onChange={(e) =>
            setPublishedYear(e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white font-medium w-full ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Adding..." : "Add Book"}
      </button>
    </form>
  );
}
