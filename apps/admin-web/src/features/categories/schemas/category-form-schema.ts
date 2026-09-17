import { z} from "zod";

export const categoryFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required")
        .max(100, "Category name must not exceed 100 characters"),
    
    description: z.string().trim().optional()
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;