import { RouteErrorBoundary } from "@/components/route-error-boundary";
import { ProtectedAdminLayout } from "@/layouts/protected-admin-layout";
import { PublicAdminLayout } from "@/layouts/public-admin-layout";
import { AdminDashboardPage } from "@/pages/admin-dashboard-page";
import { AdminLoginPage } from "@/pages/admin-login-page";
import { CategoriesPage } from "@/pages/categories-page";
import { NotFoundAdminPage } from "@/pages/not-found-page";
import { ProductsPage } from "@/pages/products-page";
import { createBrowserRouter, Navigate } from "react-router-dom";






export const router = createBrowserRouter([
    {
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                element: <PublicAdminLayout />,
                children: [
                    {
                        path: "login",
                        element: <AdminLoginPage />,
                    },
                    {
                        path: "*",
                        element: <NotFoundAdminPage />,
                    },
                ]
            },
            {
                element: <ProtectedAdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/dashboard" replace />,
                    },
                    {
                        path: "dashboard",
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: "categories",
                        element: <CategoriesPage />
                    },
                    {
                        path: "products",
                        element: <ProductsPage />
                    }
                ]
            }

        ]
    }
])