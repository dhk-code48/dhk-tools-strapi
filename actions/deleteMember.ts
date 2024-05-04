"use server";

import prismadb from "@/lib/prismadb";

export const deleteMember = async (id: string) => {
  const issueRelatedToMember = await prismadb.issueRecord.count({
    where: {
      memberId: id,
      returnState: false,
    },
  });

  try {
    if (issueRelatedToMember === 0) {
      await prismadb.issueRecord.deleteMany({
        where: {
          memberId: id,
        },
      });
      await prismadb.member.delete({
        where: {
          id,
        },
      });
    } else {
      return { error: "Delete all the issue related to the member first !!" };
    }
  } catch (error) {
    return { error: "Something went wrong" };
  }

  return { success: "Member Deleted Success" };
};
