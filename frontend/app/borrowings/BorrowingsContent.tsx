"use client";

import React, { useEffect, useState } from "react";
import { Borrowing } from "@/app/types/borrowing";
import { Book } from "@/app/types/book";
import { OverdueBorrowing } from "@/app/types/overdueBorrowing";

type Props = {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
};

export default function BorrowingsContent({ books, setBooks }: Props) {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [overdueMap, setOverdueMap] = useState<Map<number, OverdueBorrowing>>(
    new Map(),
  );

  // ---------------------------
  // FETCH ALL BORROWINGS
  // ---------------------------
  async function fetchBorrowings() {
    const res = await fetch("http://localhost:8000/borrowings");
    const data = await res.json();
    setBorrowings(data);
  }

  // ---------------------------
  // FETCH OVERDUE BORROWINGS
  // ---------------------------
  async function fetchOverdueBorrowings() {
    const res = await fetch("http://localhost:8000/borrowings/overdue");
    const data: OverdueBorrowing[] = await res.json();

    const map = new Map<number, OverdueBorrowing>();
    data.forEach((b) => {
      map.set(b.borrowing_id, b);
    });

    setOverdueMap(map);
  }

  // ---------------------------
  // RETURN BORROWING
  // ---------------------------
  async function handleReturn(borrowingId: number) {
    await fetch(`http://localhost:8000/borrowings/${borrowingId}/return`, {
      method: "PUT",
    });

    fetchBorrowings();
    fetchOverdueBorrowings();
  }

  // ---------------------------
  // INITIAL LOAD
  // ---------------------------
  useEffect(() => {
    fetchBorrowings();
    fetchOverdueBorrowings();
  }, []);

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Borrowings</h1>

      {borrowings.length === 0 && (
        <p className="text-gray-400">No borrowings found</p>
      )}

      <ul className="space-y-4">
        {borrowings.map((b) => {
          const overdue = overdueMap.get(b.id);
          const isOverdue = overdue && b.returned_at === null;

          const book = books.find((bk) => bk.id === b.book_id);

          return (
            <li
              key={b.id}
              className={`border p-4 rounded
                ${isOverdue ? "border-red-500 bg-red-900/30" : "border-white"}
              `}
            >
              <div className="font-semibold">
                Book: {book?.title ?? "Unknown"}
              </div>

              <div>Borrowed at: {b.borrowed_at}</div>

              {b.returned_at ? (
                <div className="text-green-400">
                  Returned at: {b.returned_at}
                </div>
              ) : (
                <button
                  onClick={() => handleReturn(b.id)}
                  className="mt-3 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
                >
                  Return
                </button>
              )}

              {isOverdue && overdue && (
                <>
                  <div className="text-red-400 font-semibold mt-2">
                    ⚠ Overdue
                  </div>
                  <div className="text-yellow-400">
                    Due date: {new Date(overdue.due_date).toLocaleDateString()}
                  </div>
                  <div className="text-yellow-400 font-medium">
                    Fine: ₹{overdue.fine}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
