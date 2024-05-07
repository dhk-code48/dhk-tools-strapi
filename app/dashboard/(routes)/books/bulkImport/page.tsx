"use client";
import bulkCreateBook from "@/actions/bulkCreateBook";
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
import { BookSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import readXlsxFile from "read-excel-file";
import * as z from "zod";

type ProductFormValues = z.infer<typeof BookSchema>;

const BookBulkImport = () => {
  const [excelfile, setExcelFile] = useState<File | null>(null);
  const [bulkData, setBulkData] = useState<Book[]>([]);

  useEffect(() => {
    if (excelfile) {
      readXlsxFile(excelfile).then((rows) => {
        rows.forEach((row, i) => {
          i !== 0 &&
            setBulkData((prev) => [
              ...prev,
              {
                id: row[0].toString(),
                name: row[1].toString(),
                publication: row[2].toString(),
                authors: row[3].toString(),
                totalPages: row[4].toString(),
                price: row[5].toString(),
                stock: parseInt(row[6].toString()),
                total: parseInt(row[6].toString()),
                categoryId: row[7].toString(),
                imageUrl: "",
                bannerUrl: null,
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
      bulkCreateBook(bulkData)
        .then(() => {
          toast.success("Added Succesfully !");
          window.location.assign("/dashboard/books");
        })
        .catch(() => toast.error("Error Can't Add Books !"));
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <Heading
          title={`Bulk Creation Of Books`}
          description="Create huge amount of books using excel"
        />
        <div className="flex items-center gap-x-5">
          <Link
            href={"/excelformats/excel.xlsx"}
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
        <TableCaption>A Perview of books to upload.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Publication</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>TotalPages</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>CategoryId</TableHead>
            <TableHead>ImageUrl</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bulkData &&
            bulkData.map((book) => (
              <TableRow key={"bulkdata-registration " + book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.publication}</TableCell>
                <TableCell>{book.authors}</TableCell>
                <TableCell>{book.totalPages}</TableCell>
                <TableCell>{book.price}</TableCell>
                <TableCell>{book.stock}</TableCell>
                <TableCell>{book.categoryId}</TableCell>
                <TableCell>
                  {book.imageUrl}
                  {/* <Image
                    src={book.imageUrl}
                    alt="Image URL"
                    width={100}
                    height={200}
                  /> */}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {bulkData && (
        <Button onClick={() => handleSubmit()} disabled={isPending}>
          Insert All Books
        </Button>
      )}
    </div>
  );
};

export default BookBulkImport;
