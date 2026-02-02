"use client";

import { useState } from "react";
import { Member } from "@/app/types/member";

type Props = {
  onAddSuccess?: (newMember: Member) => void;
};

export default function AddMemberForm({ onAddSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/members", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.detail || "Failed to add member");
        setLoading(false);
        return;
      }

      const newMember: Member = await res.json();

      // ✅ call parent callback to update UI
      if (onAddSuccess) onAddSuccess(newMember);

      // reset form
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("Add member failed:", err);
      alert("Something went wrong while adding member");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 mb-6 shadow-sm space-y-3"
    >
      <h3 className="text-lg font-semibold">Add Member</h3>

      <input
        type="text"
        placeholder="Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white w-full ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Adding..." : "Add Member"}
      </button>
    </form>
  );
}
