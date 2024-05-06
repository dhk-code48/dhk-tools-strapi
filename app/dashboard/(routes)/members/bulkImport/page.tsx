"use client";
import bulkCreateBook from "@/actions/bulkCreateBook";
import bulkCreateMember from "@/actions/bulkCreateMember";
import { createBook } from "@/actions/createBook";
import { saveImageToPublic } from "@/actions/saveImage";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import readXlsxFile from "read-excel-file";
import * as z from "zod";

type ProductFormValues = z.infer<typeof MemberSchema>;

const BookBulkImport = () => {
  const [excelfile, setExcelFile] = useState<File | null>(null);
  const [bulkData, setBulkData] = useState<Member[]>([]);

  useEffect(() => {
    if (excelfile) {
      readXlsxFile(excelfile).then((rows) => {
        rows.forEach((row, i) => {
          i !== 0 &&
            setBulkData((prev) => [
              ...prev,
              {
                name: row[0].toString(),
                phone: row[1].toString(),
                address: row[2].toString(),
                id: "",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]);
        });
      });
    }
  }, [excelfile]);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit() {
    startTransition(() => {
      bulkCreateMember(bulkData)
        .then((data) => {
          if (data.success) {
            toast.success("Added Succesfully !");
            window.location.assign("/dashboard/members");
          }
          if (data.error) {
            toast.error("Error while adding !");
          }
        })
        .catch(() => toast.error("Error Can't Add members !"));
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <Heading
          title={`Bulk Creation Of Members`}
          description="Create huge amount of members using excel"
        />
        <div className="flex items-center gap-x-5">
          <Link
            href={"/excelformats/member.xlsx"}
            target="_blank"
            className={buttonVariants()}
          >
            Download Excel Format
          </Link>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="excelfile">Import Excel File</Label>
            <Input
              className="lg:w-[300px]"
              id="excelfile"
              type="file"
              placeholder="Import Excel File"
              onChange={(e) =>
                setExcelFile(e.target.files && e.target.files[0])
              }
            />
          </div>
        </div>
      </div>
      <Table>
        <TableCaption>A Perview of members to upload.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bulkData &&
            bulkData.map((member) => (
              <TableRow key={"bulkdata-member " + member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>{member.phone}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {bulkData && (
        <Button onClick={() => handleSubmit()} disabled={isPending}>
          Insert All Members
        </Button>
      )}
    </div>
  );
};

export default BookBulkImport;
