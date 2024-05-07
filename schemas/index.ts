import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const SchoolSchema = z.object({
  name: z.string().min(1),
});

export const CategorySchema = z.object({
  name: z.string().min(2),
});

export const MemberSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(2),
  address: z.string().min(2),
});

export const IssueRecordSchema = z.object({
  memberId: z.string().min(2),
  returnState: z.boolean().default(false).optional(),
});

export const BookSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  price: z.string().min(1),
  publication: z.string().min(1),
  totalPages: z.string().min(1),
  id: z.string().min(1),
  categoryId: z.string().min(1),
  authors: z.string().min(1),
  stock: z.string().min(1),
});
