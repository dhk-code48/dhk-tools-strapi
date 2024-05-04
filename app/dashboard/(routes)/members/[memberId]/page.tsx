import prismadb from "@/lib/prismadb";

import { MemberForm } from "./_components/member-form";
import { DataTable } from "@/components/ui/data-table";
import {
  IssueRecordColumn,
  columns,
} from "../../issueRecords/_components/columns";
import moment from "moment";
import { Heading } from "@/components/ui/heading";

const MemberPage = async ({ params }: { params: { memberId: string } }) => {
  const member = await prismadb.member.findUnique({
    where: {
      id: params.memberId,
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

  const formattedRecords: IssueRecordColumn[] | null =
    member &&
    member.issueRecords.map((item) => ({
      id: item.id,
      name: member.name,
      book: item.book,
      createdAt: moment(item.createdAt).fromNow(),
    }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 mb-10">
        <MemberForm initialData={member} />
      </div>
      {member && (
        <Heading
          title={member.name + " Issue Record"}
          description="View and menage members record directly from here"
        />
      )}
      {formattedRecords && (
        <DataTable columns={columns} data={formattedRecords} searchKey="book" />
      )}
    </div>
  );
};

export default MemberPage;