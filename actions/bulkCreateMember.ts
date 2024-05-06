"use server";
import { Member } from "@prisma/client";
import prismadb from "@/lib/prismadb";

const bulkCreateMember = async (members: Member[]) => {
  try {
    members.forEach(async (member) => {
      await prismadb.member.create({
        data: {
          name: member.name,
          address: member.address,
          phone: member.phone,
        },
      });
    });
  } catch (error) {
    console.log("CREATE_Members_ERROR");
    return { error: "Something went wrong" };
  }

  return { success: "Members Created !" };
};

export default bulkCreateMember;
