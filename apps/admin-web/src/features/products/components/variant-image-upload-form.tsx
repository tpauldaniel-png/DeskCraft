import {useForm } from "react-hook-form";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { LoadingButton } from "@/components/shared/loading-button";
import { useRef, useState } from "react";



type ImageFormValues = {
    image: FileList;
    alt_text: string;
};


type VariantImageUploadFormProps = {
    onSubmit: (formData: FormData) => Promise<unknown>;
    isPending: boolean;
    
};

const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const maxSize = 5 * 1024 * 1024; // 5MB

export function VariantImageUploadForm({onSubmit, isPending}: VariantImageUploadFormProps) {

    const formRef = useRef<HTMLFormElement>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const {register, handleSubmit, reset, formState: {isSubmitting, errors}} = useForm<ImageFormValues>({
        defaultValues: {alt_text: ""}
    });

    async function Submit(values: ImageFormValues) {
        const file = values.image?.[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("alt_text", values.alt_text.trim());

        setUploadError(null);

        try {
            await onSubmit(formData);
            reset();
            formRef.current?.reset();
        } catch (error) {
            setUploadError("Failed to upload image. Please try again.");
        }

    }


    

    return(
        <form noValidate onSubmit={handleSubmit(Submit)} ref={formRef}>
            
            <FieldGroup>
                <Field data-invalid={Boolean(errors.image)}>
                    <FieldLabel htmlFor="variant-image">
                        Upload Image
                    </FieldLabel>
                    <input
                        type="file"
                        id="variant-image"
                        accept="image/jpeg, image/png, image/gif, image/webp"
                        className="block w-full cursor-pointer rounded-md border bg-background text-sm text-muted-foreground file:mr-3 file:border-r
                            file:border-border file:bg-transparent file:py-2 file:px-3 file:text-sm file:font-medium hover:file:bg-accent hover:file:text-accent-foreground hover:file:cursor-pointer"
                        {...register("image", {
                            validate: (files) => {
                                const file = files?.[0];
                                if (!file) return "Please select an image file.";
                                if (!allowedTypes.includes(file.type)) return "Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.";
                                if (file.size > maxSize || file.size < 1024)  return "File size must be between 1KB and 5MB.";
                                return true;
                            }
                        })}

                    />
                    {errors.image && (
                        <FieldError>
                            {errors.image.message}
                        </FieldError>
                    )}
                </Field>

                <Field data-invalid={Boolean(errors.alt_text)}>
                    <FieldLabel htmlFor="variant-image-alt-text">
                        Alt Text
                    </FieldLabel>
                    <input
                        type="text"
                        id="variant-image-alt-text"
                        placeholder="Describe what the image is about"
                        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
                        {...register("alt_text", {
                            validate: (value) => {
                                const length = value.trim().length;
                                return(
                                    length >= 1 && length <= 255 ||
                                    "Alt text must be between 1 and 255 characters."
                                )
                            }       
                        })}
                    
                    />

                    {errors.alt_text && (
                        <FieldError>
                            {errors.alt_text.message}
                        </FieldError>
                    )}
                </Field>

                {uploadError && (
                    <p className="text-sm text-destructive mt-1">
                        {uploadError}
                    </p>
                )}

                <LoadingButton
                    isLoading={isSubmitting || isPending}
                    loadingText="Uploading..."
                    type="submit"
                    className="w-full h-11 mt-2"
                >
                    Upload Image
                </LoadingButton>
            </FieldGroup>
        </form>
    )
}