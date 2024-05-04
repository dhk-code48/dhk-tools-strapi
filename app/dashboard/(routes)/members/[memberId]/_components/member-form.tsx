"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Member } from "@prisma/client";

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
import { AlertModal } from "@/components/modals/alert-modal";
import { MemberSchema } from "@/schemas";
import { updateMember } from "@/actions/updateMember";
import { createMember } from "@/actions/createMember";
import { deleteMember } from "@/actions/deleteMember";

type MemberFormValues = z.infer<typeof MemberSchema>;

interface MemberFormProps {
  initialData: Member | null;
}

export const MemberForm: React.FC<MemberFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "Edit Member" : "Create Member";
  const description = initialData ? "Edit a Member." : "Add a new Member";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(MemberSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof MemberSchema>) => {
    startTransition(() => {
      initialData &&
        initialData.id &&
        updateMember(values, initialData.id)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/members/" + initialData.id);
            }
          })
          .catch(() => toast.error("Something went wrong"));
      !initialData &&
        createMember(values)
          .then((data) => {
            if (data?.error) {
              form.reset();
              toast.error(data.error);
            }

            if (data?.success) {
              form.reset();
              toast.success(data.success);
              window.location.assign("/dashboard/members/");
            }
          })
          .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = async () => {
    startTransition(() => {
      initialData &&
        deleteMember(initialData.id)
          .then((data) => {
            if (data?.error) {
              toast.error("Delete All Issue Related to the member first !!");
            }
            if (data?.success) {
              toast.success("Successfullt deleated");
              window.location.assign("/dashboard/members");
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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Member name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Member phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Member address"
                      {...field}
                    />
                  </FormControl>
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
