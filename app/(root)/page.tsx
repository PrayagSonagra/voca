import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import { sampleBooks } from "@/components/lib/constants";

const page = () => {
  return (
    <main className="container wrapper">

      <HeroSection />
      <div className='library-books-grid'>
        {sampleBooks.map((book) => (
          <BookCard key={book._id} author={book.author} title={book.title} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  );
};

export default page;
