import prismadb from "@/lib/prismadb";

import { MembersClient } from "./_components/client";
import { Book, IssueRecord, Member } from "@prisma/client";

const MembersPage = async () => {
  const products = await prismadb.member.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      issueRecords: {
        where: {
          returnState: false,
        },
        include: {
          book: true,
        },
      },
    },
  });

  const formattedProducts: (Member & {
    issueRecords: (IssueRecord & { book: Book })[];
  })[] = products.map((item) => ({
    id: item.id,
    address: item.address,
    phone: item.phone,
    issueRecords: item.issueRecords,
    name: item.name,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1">
        <MembersClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default MembersPage;
