
import {z} from "zod";



export const productFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name is required")
        .max(200, "Product name must not exceed 200 characters"),
    description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),
    category_id: z
        .string()
        .min(1, "Category is required"),
    specifications: z.object({
        material: z.string().nullable(),
        adjustment_feature: z.string().nullable(),
        max_load_kg: z.number().nullable(),
        assembly_required: z.boolean().nullable(),
    }).optional()
    
    
})

export type ProductFormData = z.infer<typeof productFormSchema>;