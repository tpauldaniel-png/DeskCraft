
export type AuthUser = {
    id: string;
    first_name : string;
    last_name: string;
    email: string;
    phone_number: string | null;
    role: "customer" | "admin";
    is_active: boolean;
}