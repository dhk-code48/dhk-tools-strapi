"use server";

import { CategorySchema } from "@/schemas";
import * as z from "zod";
import prismadb from "@/lib/prismadb";

export const updateCategory = async (
  values: z.infer<typeof CategorySchema>,
  batchId: string
) => {
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name } = validatedFields.data;

  try {
    await prismadb.category.update({
      where: {
        id: batchId,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Category Updated Success" };
};
