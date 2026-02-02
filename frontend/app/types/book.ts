export type Book = {
  id: number;
  title: string;
  author: string;
  copies_available: number;
  isbn: string | null;
  published_year: number | null;
  created_at: string;
};