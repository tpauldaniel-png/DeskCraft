import {z} from "zod"


export const registerSchema = z.object({
    firstName : z
        .string()
        .trim()
        .min(1, "First Name is Required")
        .max(100,"First name must be 100 characters or fewer"),
    lastName: z
        .string()
        .trim()
        .min(1, "Last Name is Required")
        .max(100, "Last name must be 100 characters or fewer"),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Email is Required")
        .pipe(z.email({error: "Enter a valid email address"})),
    phoneNumber: z.union([
        z.literal(""),
        z.e164({error: "Use International format, for example +919876543210"})
    ]),

    password: z
        .string()
        .min(8, "Password must contain atleast 8 characters")
        .max(20, "Password must contain atmost 20 characters"),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

