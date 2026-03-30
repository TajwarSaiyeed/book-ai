import BookCard from "@/components/book-card";
import Hero from "@/components/hero";
import Search from "@/components/search";
import { getAllBooks } from "@/lib/actions/book.actions";
import { sampleBooks } from "@/lib/constants";
import { Suspense } from "react";

export default async function HomePage({ searchParams }: { searchParams: { query?: string } }) {
  const { query } = await searchParams;

  const bookResults = await getAllBooks(query);
  const books = bookResults.success ? (bookResults.data ?? []) : [];
  return (
    <main className="wrapper container">
      <Hero />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <h2 className="text-3xl font-serif font-bold text-[#212a3b]">Recent Books</h2>
        <Suspense fallback={<div className="h-10 w-full sm:w-80" />}>
          <Search />
        </Suspense>
      </div>

      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </main>
  );
}
