"use server";

import prismadb from "@/lib/prismadb";

export const deleteCategory = async (categoryId: string) => {
  try {
    await prismadb.category.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Category Deleted Success" };
};