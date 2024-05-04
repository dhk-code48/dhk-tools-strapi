"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { Book } from "@prisma/client";
import Image from "next/image";

export type IssueRecordColumn = {
  id: string;
  name: string;
  book: Book;
  createdAt: string;
};

export const columns: ColumnDef<IssueRecordColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "book",
    header: "Book",
    cell: ({ row }) => {
      const book: Book = row.getValue("book");
      return (
        <div className="flex items-center gap-x-5">
          <Image
            src={"/img/" + book.imageUrl}
            alt="book banner"
            width={100}
            height={200}
            className="w-[40px] rounded-lg"
          />
          {book.name}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
