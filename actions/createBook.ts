"use server";

import { BookSchema } from "@/schemas";
import * as z from "zod";
import db from "@/lib/prismadb";
import prismadb from "@/lib/prismadb";

export const createBook = async (
  values: z.infer<typeof BookSchema>,
  category?: string
) => {
  const validatedFields = BookSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const {
    name,
    authors,
    categoryId,
    id,
    imageUrl,
    price,
    publication,
    stock,
    totalPages,
  } = validatedFields.data;

  const customCategory =
    category &&
    (await prismadb.category.findFirst({
      where: {
        name: category,
      },
    }));

  try {
    await db.book.create({
      data: {
        name,
        authors,
        imageUrl: id + ".jpg",
        price,
        publication,
        stock: parseInt(stock),
        totalPages,
        categoryId: category
          ? customCategory
            ? customCategory.id
            : ""
          : categoryId,
        total: parseInt(stock),
        id,
      },
    });
  } catch (error) {
    console.log("CREATE_BOOK_ERROR");
    return { error: "Something went wrong" };
  }

  return { success: "Book Created !" };
};
