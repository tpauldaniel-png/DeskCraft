import { useForm, type SubmitHandler } from "react-hook-form";
import { categoryFormSchema, type CategoryFormValues } from "../schemas/category-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/shared/loading-button";
import { Textarea } from "@/components/ui/textarea";


type CategoryFormProps = {
    onSubmit: SubmitHandler<CategoryFormValues>;
    isPending: boolean;
    submitLabel: string;
    loadingText: string;
    defaultValues?: CategoryFormValues;

}




export function CategoryForm({onSubmit, isPending, loadingText, submitLabel}: CategoryFormProps) {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const isLoading = isPending || isSubmitting

    return(
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <Field data-invalid={Boolean(errors.name)}>
                    <FieldLabel htmlFor="category-name">Category Name: </FieldLabel>
                    <Input
                        id="category-name"
                        type="text"
                        aria-invalid={Boolean(errors.name)}
                        placeholder="Enter your Category name"
                        className="h-11"
                        {...register("name")}
                    />
                    {errors.name && (
                        <FieldError errors={[errors.name]}/>
                    )}
                </Field>

                <Field data-invalid={Boolean(errors.description)}>
                    <FieldLabel htmlFor="category-description">Description: </FieldLabel>
                    <Textarea
                        id="category-description"
                        aria-invalid={Boolean(errors.description)}
                        placeholder="Enter a short category Description"
                        className="h-11"
                        {...register("description")}
                    />
                    {errors.description && (
                        <FieldError errors={[errors.description]}/>
                    )}
                </Field>
            </FieldGroup>

            <LoadingButton
                type="submit"
                isLoading={isLoading}
                className="h-11 w-full"
                loadingText={loadingText}
            >
                {submitLabel}
            </LoadingButton>
        </form>
    )
    
    
}

