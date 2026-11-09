import { isAxiosError } from "axios";

type ApiErrorResponse = {
  error?: { message?: string };
  detail?: unknown;
};


const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


export function formatCartMoney(value: string): string {
  if (!value.trim()) return "—";
  const amount = Number(value);
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : "—";
}

export function getCartErrorMessage(
  error: unknown,
  fallback = "Unable to update your cart. Please try again.",
): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    const data = error.response?.data;
    if (typeof data?.error?.message === "string") {
      return data.error.message;
    }

    if (typeof data?.detail === "string") return data.detail;
  }
  return fallback;
}