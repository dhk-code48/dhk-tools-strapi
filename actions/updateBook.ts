"use server";

import { BookSchema } from "@/schemas";
import * as z from "zod";
import prismadb from "@/lib/prismadb";

export const updateBook = async (
  values: z.infer<typeof BookSchema>,
  batchId: string
) => {
  const validatedFields = BookSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const {
    id,
    name,
    authors,
    imageUrl,
    price,
    publication,
    stock,
    totalPages,
    categoryId,
  } = validatedFields.data;

  try {
    await prismadb.book.update({
      where: {
        id: batchId,
      },
      data: {
        id,
        name,
        authors,
        imageUrl,
        price,
        stock: parseInt(stock),
        publication,
        totalPages,
        categoryId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Book Updated!" };
};
