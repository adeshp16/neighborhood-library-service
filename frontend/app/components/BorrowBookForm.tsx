"use client";

import { useState } from "react";
import { Member } from "@/app/types/member";

type Props = {
  bookId: number;
  members: Member[];
  onBorrowSuccess?: () => void;
};

export default function BorrowBookForm({
  bookId,
  members,
  onBorrowSuccess,
}: Props) {
  const [selectedMember, setSelectedMember] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  async function handleBorrow(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMember) {
      alert("Please select a member");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/borrowings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          member_id: selectedMember,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Failed to borrow book");
        setLoading(false);
        return;
      }

      alert("Book borrowed successfully!");
      setSelectedMember("");
      onBorrowSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while borrowing the book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleBorrow} className="mt-2 flex items-center gap-2">
      <select
        value={selectedMember}
        onChange={(e) => setSelectedMember(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      >
        <option value="">Select Member</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className={`px-3 py-1 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Borrowing..." : "Borrow"}
      </button>
    </form>
  );
}
