import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import type { ProductFormData } from "../schemas/product-form-schema"
import { zodResolver } from "@hookform/resolvers/zod";

import { productFormSchema } from "../schemas/product-form-schema";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/shared/loading-button";
import type { Category } from "@/features/categories/types/category";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type ProductFormProps = {
    categories: Category[];
    onSubmit: SubmitHandler<ProductFormData>
    isPending: boolean;
    submitLabel: string;
    loadingText: string;
    defaultValues?: ProductFormData
}


export function ProductForm({categories, onSubmit, isPending, submitLabel, loadingText, defaultValues}: ProductFormProps) {
    
    const {
        register,
        handleSubmit,
        control,
        formState: {isSubmitting, errors} 
    } = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: defaultValues ?? {
            name: "",
            description: "",
            category_id:"",
        }
    })

    const isLoading = isPending || isSubmitting;

    const categoryItems = categories.filter(category => category.is_active).map(category => ({
        value: category.category_id,
        label: category.name,
    }))

    return(
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="category_id"
                    control={control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="product-category">
                                Category
                            </FieldLabel>
                            <Select
                                items={categoryItems}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger id="product-category" className="h-11 w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>

                                <SelectContent>
                                    {categoryItems.map(category => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Field data-invalid={Boolean(errors.name)}>
                    <FieldLabel htmlFor="product-name">Product Name: </FieldLabel>
                    <Input
                        id="product-name"
                        type="text"
                        aria-invalid={Boolean(errors.name)}
                        placeholder="Enter your Product name"
                        className="h-11"
                        {...register("name")}
                    />

                    {errors.name && (
                        <FieldError errors={[errors.name]}/>
                    )}
                    
                </Field>

                <Field data-invalid={Boolean(errors.description)} className="mb-4">
                    <FieldLabel htmlFor="product-description">Description: </FieldLabel>
                    <Input
                        id="product-description"
                        type="text"
                        aria-invalid={Boolean(errors.description)}
                        placeholder="Enter your Product description"
                        className="h-11"
                        {...register("description")}
                    />
                    {errors.description && (
                        <FieldError errors={[errors.description]}/>
                    )}
                </Field>
            </FieldGroup>

            <LoadingButton
                isLoading={isLoading}
                loadingText={loadingText}
                type="submit"
                className="w-full h-11"
                
            >
                {submitLabel}
            </LoadingButton>
        </form>
    )


}