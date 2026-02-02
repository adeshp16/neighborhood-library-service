"use client";

import { useState } from "react";
import { Member } from "@/app/types/member";
import EditMemberForm from "./EditMemberForm";

type Props = {
  members: Member[];
  onDeleteSuccess?: (id: number) => void;
};

export default function MemberList({ members, onDeleteSuccess }: Props) {
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

  async function handleDelete(member: Member) {
    if (!confirm(`Are you sure you want to delete member "${member.name}"`))
      return;

    try {
      const res = await fetch(`http://localhost:8000/members/${member.id}`, {
        method: "DELETE",
      });

      if (res.status === 400) {
        const data = await res.json();
        alert(data.detail || "Cannot delete member with borrowings");
        return;
      }

      if (onDeleteSuccess) onDeleteSuccess(member.id);
    } catch (err) {
      console.error("Failed to delete member:", err);
      alert("Failed to delete member. See console for details.");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Members ({members.length})</h2>

      <ul className="space-y-4">
        {members.map((member) => (
          <li
            key={member.id.toString()}
            className="border rounded-lg p-4 shadow-sm"
          >
            {editingMemberId === member.id ? (
              <EditMemberForm
                member={member}
                onCancel={() => setEditingMemberId(null)}
              />
            ) : (
              <>
                <div className="font-semibold text-lg">{member.name}</div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  {member.email ?? "Not provided"}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Phone:</span>{" "}
                  {member.phone ?? "Not provided"}
                </div>

                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => setEditingMemberId(member.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(member)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
