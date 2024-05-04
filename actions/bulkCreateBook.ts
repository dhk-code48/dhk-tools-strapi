"use server";
import { Book } from "@prisma/client";
import { saveImageToPublic } from "./saveImage";
import prismadb from "@/lib/prismadb";

const bulkCreateBook = async (books: Book[]) => {
  try {
    books.forEach(async (book) => {
      const customCategory = await prismadb.category.findFirst({
        where: {
          name: book.categoryId,
        },
      });
      customCategory &&
        (await saveImageToPublic(book.imageUrl, book.id + ".jpg"));
      customCategory &&
        (await prismadb.book.create({
          data: {
            name: book.name,
            authors: book.authors,
            imageUrl: book.id + ".jpg",
            price: book.price,
            publication: book.publication,
            stock: book.stock,
            totalPages: book.totalPages,
            categoryId: customCategory.id,

            total: book.stock,
            id: book.id,
          },
        }));
    });
  } catch (error) {
    console.log("CREATE_BOOK_ERROR");
    return { error: "Something went wrong" };
  }

  return { success: "Book Created !" };
};

export default bulkCreateBook;
