import { createBrowserRouter } from "react-router-dom"

import { PublicLayout } from "@/layouts/public-layout"
import { HomePage } from "@/pages/home-page"
import { RootErrorBoundary } from "@/components/route-error-boundary"




export const router = createBrowserRouter([
    {
        errorElement: <RootErrorBoundary />,
        children: [
            {
                element: <PublicLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />
                    },
                    {
                        path: "login",
                        lazy: async () => {
                            const { LoginPage } = await import("@/pages/login-page");
                            return {
                                Component: LoginPage,
                            };
                        },
                    },
                    {
                        path: "register",
                        lazy: async () => {
                            const { RegisterPage } = await import("@/pages/register-page");
                            return {
                                Component: RegisterPage,
                            };
                        },
                    },
                    {
                        path: "products",
                        lazy: async () => {
                            const { ProductsPage } = await import("@/pages/products-page");
                            return {
                                Component: ProductsPage,
                            };
                        },
                    },
                    {
                        path: "products/:slug",
                        lazy: async () => {
                            const { ProductDetailPage } = await import("@/pages/product-detail-page");
                            return {
                                Component: ProductDetailPage,
                            };
                        },
                    },
                    {
                        path: "*",
                        lazy: async() => {
                            const { NotFoundPage } = await import("@/pages/not-found-page");
                            return {
                                Component: NotFoundPage,
                            };
                        },
                    },
                ]
            },
            {
                lazy: async() => {
                    const { ProtectedLayout } = await import("@/layouts/protected-layout");
                    return {
                        Component: ProtectedLayout,
                    };
                },
                children: [
                    {
                        path: "cart",
                        lazy: async () => {
                            const { CartPage } = await import("@/pages/cart-page");
                            return {
                                Component: CartPage,
                            };
                        },
                    },
                    {
                        path: "addresses",
                        lazy: async () => {
                            const { AddressesPage } = await import("@/pages/addresses-page");
                            return {
                                Component: AddressesPage,
                            };
                        },
                    },
                    {
                        path: "account",
                        lazy: async () => {
                            const { AccountPage } = await import("@/pages/account-page");
                            return {
                                Component: AccountPage,
                            };
                        },
                    },
                ]
            }
        ]
    }
])
    
