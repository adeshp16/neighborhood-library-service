"use client";

import { useState, useEffect, useRef } from "react";
import AddMemberForm from "@/app/components/AddMemberForm";
import MemberList from "@/app/components/MemberList";
import { Member } from "@/app/types/member";

export default function MembersContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchMembers();
  }, []);

  // async function fetchMembers() {
  //   const res = await fetch("http://localhost:8000/members");
  //   const data = await res.json();
  //   setMembers(data);
  // }
  async function fetchMembers() {
    console.log("Fetching members from backend...");
    const res = await fetch("http://localhost:8000/members");
    const data = await res.json();
    setMembers(data);
  }

  // ✅ when a member is added
  function handleMemberAdded(newMember: Member) {
    setMembers((prev) => [newMember, ...prev]);
  }

  // ✅ when a member is deleted
  function handleMemberDeleted(memberId: number) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  return (
    <main className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Members</h1>

      <AddMemberForm onAddSuccess={handleMemberAdded} />

      <MemberList members={members} onDeleteSuccess={handleMemberDeleted} />
    </main>
  );
}
