"use server";

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }
    return {
      exists: false,
    };
  } catch (error) {
    console.log("Error checking book", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(data.title);
    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    const book = await Book.create({
      ...data,
      slug,
      totalSegments: 0,
    });

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.log("Error creating book", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);

    await Book.findByIdAndUpdate(bookId, {
      totalSegments: segments.length,
    });
    console.log("succesfully created segments for bookId", bookId);

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    };
  } catch (error) {
    console.log(`error creating segments for bookId ${bookId}`, error);

    await BookSegment.deleteMany({ bookId });
    await Book.findByIdAndDelete(bookId);
    console.log("succesfully deleted book and residual segments");
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const getAllBooks = async () => {
  try {
    await connectToDatabase();

    const books = await Book.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: serializeData(books),
    };
  } catch (error) {
    console.log("Error getting all books", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const searchBookSegments = async (
  bookId: string,
  query: string,
  topN: number = 3,
) => {
  try {
    await connectToDatabase();

    const segments = await BookSegment.find(
      {
        bookId,
        $text: { $search: query },
      },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(topN)
      .lean();

    return {
      success: true,
      data: serializeData(segments),
    };
  } catch (error) {
    console.log(`Error searching book segments for bookId ${bookId}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    const book = await Book.findOne({ slug }).lean();

    if (!book) {
      return {
        success: false,
        error: "Book not found",
      };
    }

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.log(`Error getting book by slug ${slug}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
