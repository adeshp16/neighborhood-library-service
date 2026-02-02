"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Member } from "@/app/types/member";

type EditMemberFormProps = {
  member: Member;
  onCancel: () => void;
};

export default function EditMemberForm({
  member,
  onCancel,
}: EditMemberFormProps) {
  const router = useRouter();

  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email ?? "");
  const [phone, setPhone] = useState(member.name ?? "");

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    await fetch(`http://localhost:8000/members/${member.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email: email || null,
        phone: phone || null,
      }),
    });

    onCancel();
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 shadow-sm space-y-3"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
