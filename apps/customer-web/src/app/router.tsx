import { createBrowserRouter } from "react-router-dom"

import { PublicLayout } from "@/layouts/public-layout"
import { HomePage } from "@/pages/home-page"
import { LoginPage } from "@/pages/login-page"
import { RegisterPage } from "@/pages/register-page"
import { ProtectedLayout } from "@/layouts/protected-layout"
import { AccountPage } from "@/pages/account-page"
import { NotFoundPage } from "@/pages/not-found-page"
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
                        element: <HomePage />,
                    },
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                    {
                        path: "*",
                        element: <NotFoundPage />,
                    },
                ],

            },
            {
                element: <ProtectedLayout />,
                children: [
                    {
                        path: "account",
                        element: <AccountPage />,

                    }
                ]
            },
        ],
    },
])
    
