"use server";

import { IssueRecordSchema } from "@/schemas";
import * as z from "zod";
import db from "@/lib/prismadb";

export const createIssueRecord = async (memberId: string, books: string[]) => {
  try {
    books.forEach(async (bookId) => {
      await db.issueRecord.create({
        data: {
          bookId,
          returnState: false,
          memberId,
        },
      });
      await db.book.update({
        where: {
          id: bookId,
        },
        data: {
          stock: {
            increment: -1,
          },
        },
      });
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Record Created !" };
};
