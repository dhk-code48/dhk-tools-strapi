"use server";

import { MemberSchema } from "@/schemas";
import * as z from "zod";
import db from "@/lib/prismadb";

export const createMember = async (values: z.infer<typeof MemberSchema>) => {
  const validatedFields = MemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, address, phone } = validatedFields.data;

  try {
    await db.member.create({
      data: {
        name,
        address,
        phone,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Member Created !" };
};
