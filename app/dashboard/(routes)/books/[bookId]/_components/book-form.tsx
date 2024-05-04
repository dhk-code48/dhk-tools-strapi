"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Book, Category } from "@prisma/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookSchema } from "@/schemas";
import { updateBook } from "@/actions/updateBook";
import { deleteBook } from "@/actions/deleteBook";
import { AlertModal } from "@/components/modals/alert-modal";
import { createBook } from "@/actions/createBook";
import uploadImage from "@/actions/uploadImage";
import Image from "next/image";

type ProductFormValues = z.infer<typeof BookSchema>;

interface BookFormProps {
  initialData: Book | null;
  categories: Category[] | null;
}

export const BookForm: React.FC<BookFormProps> = ({
  initialData,
  categories,
}) => {
  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Book" : "Create Book";
  const description = initialData ? "Edit a Book." : "Add a new Book";
  const action = initialData ? "Save changes" : "Create";

  const [file, setFile] = useState<File | null>(null);

  const defaultValues = {
    id: initialData ? initialData.id : "",
    name: initialData ? initialData.name : "",
    imageUrl: initialData ? initialData.imageUrl : "",
    price: initialData ? initialData.price : "",
    publication: initialData ? initialData.publication : "",
    totalPages: initialData ? initialData.totalPages : "",
    categoryId: initialData ? initialData.categoryId : "",
    authors: initialData ? initialData.authors : "",
    stock: initialData ? initialData.stock.toString() : "",
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(BookSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof BookSchema>) => {
    let data = new FormData();
    data.append("img", file || "");
    data.append("id", values.id || "");

    try {
      const baseurl = "http://129.150.50.164:3004";
      const apiUrl = baseurl + "/api/upload";

      if (!baseurl) return null;

      await fetch(apiUrl, {
        method: "POST",
        body: data,
      }).then((res) => res && res.json());
    } catch {
      toast.error("Image must be in jpg format");
    }

    startTransition(async () => {
      initialData &&
        initialData.id &&
        updateBook(values, initialData.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/books/" + initialData.id);
            }
          })
          .catch(() => toast.error("Something went wrong"));
      !initialData && console.log("create");
      !initialData &&
        createBook(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/books/");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = async () => {
    startTransition(() => {
      initialData &&
        deleteBook(initialData.id)
          .then((data) => {
            if (data?.error) {
              toast.error("Error while deleting");
            }
            if (data?.success) {
              toast.success("Successfullt deleated");
              window.location.assign("/dashboard/books");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {initialData && (
            <Image
              src={"/img/" + initialData.imageUrl}
              width={100}
              height={200}
              alt="book banner"
            />
          )}
          <Input
            type="file"
            placeholder="Choose Book Cover"
            onChange={(e) => {
              setFile(e.target.files && e.target.files[0]);
              form.setValue("imageUrl", form.getValues().id + ".jpg");
            }}
          />
          {/* <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isPending}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="md:grid md:grid-cols-3 gap-y-8 gap-x-8">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id / Qr</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="text"
                      placeholder="Enter Qr code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Book name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter the amount of book in stock"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalPages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Pages</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="645"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter Author Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Enter Publication Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories &&
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};