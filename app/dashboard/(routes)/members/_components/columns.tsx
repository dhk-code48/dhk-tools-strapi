"use client";

import { Book, IssueRecord, Member } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const MemberColumns: ColumnDef<
  Member & { issueRecords: (IssueRecord & { book: Book })[] }
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "issueRecords",
    header: "Issued Books",
    cell: ({ row }) => {
      const issueRecords: (IssueRecord & { book: Book })[] =
        row.getValue("issueRecords");
      return (
        <>
          {issueRecords.length > 0 ? (
            issueRecords.map((record, i) => (
              <div
                key={record.id + i + 1}
                className="bg-gray-200 rounded-xl w-fit px-3 py-1"
              >
                {record.book.name}
              </div>
            ))
          ) : (
            <i>None</i>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
