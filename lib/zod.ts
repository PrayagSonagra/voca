import { z } from "zod";

export const UploadSchema = z.object({
  pdf: z
    .instanceof(File, { message: "Please upload a PDF file" })
    .refine((f) => f.type === "application/pdf", "File must be a PDF")
    .refine((f) => f.size <= 50 * 1024 * 1024, "PDF must be 50MB or less"),
  coverImage: z
    .instanceof(File)
    .refine(
      (f) =>
        ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type),
      "Cover must be an image",
    )
    .optional()
    .nullable(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or less")
    .refine((v) => !/\s{2,}/.test(v), "Title cannot contain extra spaces"),
  author: z
    .string()
    .min(1, "Author name is required")
    .max(80, "Author name must be 80 characters or less")
    .refine(
      (v) => !/\s{2,}/.test(v),
      "Author name cannot contain extra spaces",
    ),
  voice: z.string().min(1, "Please select a voice"),
});

export type UploadFormValues = z.infer<typeof UploadSchema>;
