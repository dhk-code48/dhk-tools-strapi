"use server";

import { MemberSchema } from "@/schemas";
import * as z from "zod";
import prismadb from "@/lib/prismadb";

export const updateMember = async (
  values: z.infer<typeof MemberSchema>,
  id: string
) => {
  const validatedFields = MemberSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalidate Data" };
  }

  const { name, address, phone } = validatedFields.data;

  try {
    await prismadb.member.update({
      where: {
        id,
      },
      data: {
        name,
        address,
        phone,
      },
    });
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Member Updated !" };
};
