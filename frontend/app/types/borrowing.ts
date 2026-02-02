export type Borrowing = {
  id: number;
  book_id: number;
  member_id: number;
  borrowed_at: string;  // Timestamp when borrowed
  returned_at: string | null; // null if not returned yet
};
