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
            specifications: {
                material: null,
                adjustment_feature: null,
                max_load_kg: null,
                assembly_required: null,
            }
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
                
                <label className="block text-xl font-medium text-foreground mb-2">
                    Specifications
                </label>

                
                <Field data-invalid={Boolean(errors.specifications?.material)}>
                    <FieldLabel htmlFor="product-material">Material: </FieldLabel>
                    <Input
                        id="product-material"
                        type="text"
                        aria-invalid={Boolean(errors.specifications?.material)}
                        placeholder="Enter the material"
                        className="h-11"
                        {...register("specifications.material")}
                    />
                    {errors.specifications?.material && (
                        <FieldError errors={[errors.specifications.material]}/>
                    )}
                </Field>
                <Field data-invalid={Boolean(errors.specifications?.adjustment_feature)}>
                    <FieldLabel htmlFor="product-adjustment-feature">Adjustment Feature: </FieldLabel>
                    <Input
                        id="product-adjustment-feature"
                        type="text"
                        aria-invalid={Boolean(errors.specifications?.adjustment_feature)}
                        placeholder="Enter the adjustment feature"
                        className="h-11"
                        {...register("specifications.adjustment_feature")}
                    />
                    {errors.specifications?.adjustment_feature && (
                        <FieldError errors={[errors.specifications.adjustment_feature]}/>
                    )}
                </Field>
                <Field data-invalid={Boolean(errors.specifications?.max_load_kg)}>
                    <FieldLabel htmlFor="product-max-load-kg">Max Load (kg): </FieldLabel>
                    <Input
                        id="product-max-load-kg"
                        type="number"
                        aria-invalid={Boolean(errors.specifications?.max_load_kg)}
                        placeholder="Enter the max load in kg"
                        className="h-11"
                        {...register("specifications.max_load_kg")}
                    />
                    {errors.specifications?.max_load_kg && (
                        <FieldError errors={[errors.specifications.max_load_kg]}/>
                    )}
                </Field>
                <Field data-invalid={Boolean(errors.specifications?.assembly_required)}>
                    <div className="flex items-center gap-3 py-2 ">
                        <Input
                            id="product-assembly-required"
                            type="checkbox"
                            aria-invalid={Boolean(errors.specifications?.assembly_required)}
                            className="size-4 shrink-0 cursor-pointer accent-primary"
                            {...register("specifications.assembly_required")}
                        />
                        <FieldLabel htmlFor="product-assembly-required">Assembly Required</FieldLabel>
                    </div>
                    {errors.specifications?.assembly_required && (
                        <FieldError errors={[errors.specifications.assembly_required]}/>
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