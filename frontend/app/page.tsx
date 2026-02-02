"use client";

import { useState } from "react";
import BooksContent from "./books/BooksContent";
import MembersContent from "./members/MembersContent";
import BorrowingsContent from "./borrowings/BorrowingsContent";
import { Book } from "@/app/types/book";

export default function HomePage() {
  // Sidebar active tab
  const [active, setActive] = useState<"books" | "members" | "borrowings">(
    "books",
  );

  // Shared books state for BooksContent and BorrowingsContent
  const [books, setBooks] = useState<Book[]>([]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black p-6 border-r border-white">
        <h2 className="text-2xl font-bold mb-6">Library Dashboard</h2>

        <button
          className={`block w-full text-left p-3 mb-3 rounded transition-colors duration-200 ${
            active === "books"
              ? "bg-white text-black font-semibold"
              : "hover:bg-white/10 text-white"
          }`}
          onClick={() => setActive("books")}
        >
          Books Management
        </button>

        <button
          className={`block w-full text-left p-3 mb-3 rounded transition-colors duration-200 ${
            active === "members"
              ? "bg-white text-black font-semibold"
              : "hover:bg-white/10 text-white"
          }`}
          onClick={() => setActive("members")}
        >
          Members Management
        </button>

        <button
          className={`block w-full text-left p-3 rounded transition-colors duration-200 ${
            active === "borrowings"
              ? "bg-white text-black font-semibold"
              : "hover:bg-white/10 text-white"
          }`}
          onClick={() => setActive("borrowings")}
        >
          Borrowings
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-black text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          {active === "books" && (
            <div className="bg-black text-white p-6 rounded-lg border border-white">
              <BooksContent books={books} setBooks={setBooks} />
            </div>
          )}

          {active === "members" && (
            <div className="bg-black text-white p-6 rounded-lg border border-white">
              <MembersContent />
            </div>
          )}

          {active === "borrowings" && (
            <div className="bg-black text-white p-6 rounded-lg border border-white">
              <BorrowingsContent books={books} setBooks={setBooks} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
