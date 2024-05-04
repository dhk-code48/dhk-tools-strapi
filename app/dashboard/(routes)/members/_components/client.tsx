"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";

import { MemberColumns } from "./columns";
import { Book, IssueRecord, Member } from "@prisma/client";

interface MembersClientProps {
  data: (Member & { issueRecords: (IssueRecord & { book: Book })[] })[];
}

export const MembersClient: React.FC<MembersClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Members (${data.length})`}
          description="Manage members for your library"
        />
        <Button onClick={() => router.push(`/dashboard/members/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <DataTable searchKey="name" columns={MemberColumns} data={data} />
    </>
  );
};