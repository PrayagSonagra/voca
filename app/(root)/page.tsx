import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import { getAllBooks } from "@/lib/actions/book.actions";

const page = async () => {

  const booksResult = await getAllBooks()

  const books = booksResult.success ? booksResult.data ?? [] : []
  return (
    <main className="container wrapper">

      <HeroSection />
      <div className='library-books-grid'>
        {books.map((book) => (
          <BookCard key={book._id} author={book.author} title={book.title} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  );
};

export default page;
