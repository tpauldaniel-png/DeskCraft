import type { ReactNode } from "react";

import workSpaceImage from "@/assets/customer-auth-workspace.webp";

type CustomerAuthShellProps = {
    headingId: string;
    title: string;
    description: string;
    children: ReactNode;    
}

export function CustomerAuthShell({headingId, title, description, children}: CustomerAuthShellProps) {
    return(
        <section
            aria-labelledby={headingId}
            className="flex w-full flex-1 items-start justify-center bg-background px-page py-8 md:px-page-md lg:px-page-lg"
        >
            <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:min-h-36rem lg:grid-cols-[52%_48%] xl:min-h-40rem">
                <div className="relative hidden overflow-hidden lg:block">
                    <img
                        src={workSpaceImage}
                        alt=""
                        width={1122}
                        height={1402}
                        fetchPriority="high"
                        className="absolute inset-0 size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-25 to-transparent" />

                    <div className="relative flex h-full items-end p-10 xl:p-12">
                        <div className="max-w-lg text-white">
                            <p className="text-3xl font-semibold tracking-tight xl:text-4xl">
                                Build a workspace that works for you.
                            </p>

                            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                                Discover ergonomic essentials for greater comfort, focus and better workdays.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="flex items-center justify-center bg-card px-6 py-10 sm:px-8 md:px-10 lg:px-12">
                    <div className="w-full max-w-md">
                        <p className="mb-6 text-center text-lg font-medium text-foreground lg:hidden">
                            Build a workspace that works for you.
                        </p>

                        

                        
                        <div className="mb-8">
                            <h1 
                                id={headingId} 
                                className="text-3xl font-semibold tracking-tight text-foreground text-center"
                            >
                                {title}
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground text-center">
                                {description}
                            </p>
                        </div>
                        {children}

                        
                    </div>
                </div>
            </div>
        </section>
    )
}