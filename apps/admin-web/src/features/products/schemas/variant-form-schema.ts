import {z} from "zod";

export const variantFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Variant name is required")
        .max(200, "Variant name must not exceed 200 characters"),
    price: z
        .number({  
            error: "Price is required"  
        })
        .min(0, "Price cannot be negative"),
    sku: z
        .string()
        .trim()
        .min(1, "SKU is required")
        .max(100, "SKU must not exceed 100 characters"),
});

export type VariantFormData = z.infer<typeof variantFormSchema>;