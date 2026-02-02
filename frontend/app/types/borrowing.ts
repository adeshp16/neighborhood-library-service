export type Borrowing = {
  id: number;
  book_id: number;
  member_id: number;
  borrowed_at: string;
  returned_at: string | null;
};
