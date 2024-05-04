"use server";

import db from "@/lib/prismadb";

export const updateIssueRecord = async (
  id: string,
  returnState: boolean,
  bookId: string
) => {
  try {
    await db.issueRecord.update({
      where: { id },
      data: {
        returnState,
      },
    });
    await db.book.update({
      where: { id: bookId },
      data: {
        stock: {
          increment: returnState ? 1 : 0,
        },
      },
    });
  } catch (error) {
    console.log("ERROR => ", error);
    return { error: "Something went wrong" };
  }

  return { success: "Issue Updated !" };
};
