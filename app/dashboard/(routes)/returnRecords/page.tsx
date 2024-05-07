import prismadb from "@/lib/prismadb";
import moment from "moment";
import { IssueRecordColumn } from "./_components/columns";
import { IssueRecordsClient } from "./_components/client";

const IssueRecordsPage = async () => {
  const issueRecords = await prismadb.issueRecord.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      returnState: true,
    },
    include: {
      book: true,
      member: true,
    },
  });

  const formattedRecords: IssueRecordColumn[] = issueRecords.map((item) => ({
    id: item.id,
    name: item.member.name,
    book: item.book,
    createdAt: moment(item.updatedAt).format("MMMM Do YYYY").toString(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <IssueRecordsClient data={formattedRecords} />
      </div>
    </div>
  );
};

export default IssueRecordsPage;
