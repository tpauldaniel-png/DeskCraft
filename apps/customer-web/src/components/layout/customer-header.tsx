import {Menu, ShoppingCart} from "lucide-react";
import { Link } from "react-router-dom";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import DeskCraftLogo from "@/assets/dc-logo.webp"
import { useCart } from "@/features/cart/hooks/use-cart";
import { LogOutButton } from "@/features/auth/components/logout-button";



type NavItemsProps = {
    label: string,
    href: string,
}

const navItems : NavItemsProps[] = [
    {label: "Home", href: "/"},
    {label: "Shop", href: "/products"},
    {label: "Shop by Need", href: "#shop-by-need"},
    {label: "Featured", href: "#featured"},
    {label: "AI Workspace Assistant", href:"#ai-assistant"},
    
]

const authNavItems: NavItemsProps[] = [
    {label: "Log in", href: "/login"},
    {label: "Create account", href: "/register"}
]





export function CustomerHeader() {

    const currentUser = useCurrentUser();
    const userId = currentUser.data?.user_id;
    const isSignedIn = currentUser.isSuccess && Boolean(userId);
    const isGuest = currentUser.isSuccess && currentUser.data === null;

    const cartQuery = useCart(isSignedIn ? userId : null);
    const totalQuantity = isSignedIn ? cartQuery.data?.total_quantity : undefined;

    const cartLabel = typeof totalQuantity === "number" ? `Cart, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}` : "View cart";









    return (
        <header>
            <div className="bg-card shadow-sm border-b border-border/70">
                <div className="mx-auto flex h-16 items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="shrink-0" aria-label="DeskCraft home">
                        <img src={DeskCraftLogo} alt="DeskCraft Logo" className="h-8 w-auto" height={96} width={288}/>
                    </Link>

                    <nav className="mx-auto hidden items-center gap-5 text-sm lg:flex xl:gap-8 xl:text-base">
                        {navItems.map((item) => (
                            item.href.startsWith("#") ? (
                                <a key={item.label} href={item.href} className="whitespace-nowrap">{item.label}</a>
                            ) : (
                                <Link key={item.label} to={item.href} className="whitespace-nowrap">{item.label}</Link>
                            )
                        ))}
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-4">
                        {currentUser.isPending && (
                            <span className="text-sm text-muted-foreground">Loading user...</span>
                        )}
                    </div>

                    {currentUser.isError && (
                        <Button variant="outline" type="button" size="sm" onClick={() => void currentUser.refetch()} disabled={currentUser.isFetching}>
                            {currentUser.isFetching ? "Retrying..." : "Retry"}
                        </Button>
                    )}

                    {isGuest && (
                        <nav className="ml-auto hidden items-center gap-4 whitespace-nowrap text-sm lg:flex xl:text-base">
                            {authNavItems.map((item) => (
                                <Link key={item.label} to={item.href} className="whitespace-nowrap">{item.label}</Link>
                            ))}
                        </nav>
                    )}

                    {isSignedIn && (
                        <>
                            <Link to="/cart" aria-label={cartLabel} 
                                className="relative inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-muted"
                            >
                                <ShoppingCart className="size-6" />

                                {typeof totalQuantity === "number" && totalQuantity > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground tabular-nums">
                                        {totalQuantity > 99 ? "99+" : totalQuantity}
                                    </span>
                                )}
                            </Link>
                            <div className="ml-5">
                                <LogOutButton />
                            </div>
                            
                        </>
                    )}


                    

                    <div className="ml-auto md:hidden">
                        <Sheet>
                            <SheetTrigger 
                                render={
                                    <Button
                                        variant="ghost"
                                        type="button"
                                        size="icon"
                                    />

                                }
                            >
                                <Menu className="size-6"/>
                            </SheetTrigger>

                            <SheetContent side="right">
                                <SheetHeader>
                                    <SheetTitle>DeskCraft Menu</SheetTitle>
                                    <SheetDescription>Customer Navigation Links</SheetDescription>
                                </SheetHeader>

                                <nav className="mt-8 flex flex-col gap-5 ml-5">
                                    {navItems.map((item) => (
                                        <SheetClose
                                            key={item.label}
                                            render={
                                                item.href.startsWith("#") ? (
                                                    <a href={item.href} className="text-base"/>
                                                ) : (
                                                    <Link to={item.href} className="text-base"/>
                                                )
                                            }
                                        >
                                            {item.label}
                                        </SheetClose>
                                    ))}

                                    {(isSignedIn || isGuest) && <div className="border-t" />}

                                    {isSignedIn && (
                                        <SheetClose
                                            render={<Link to="/cart" className="flex items-center gap-3 text-base"/>}
                                        >
                                            <ShoppingCart className="size-5" aria-hidden="true"/>
                                            Cart
                                            {typeof totalQuantity === "number" && totalQuantity > 0 && (
                                                <span
                                                    aria-hidden="true"
                                                    className="ml-auto text-sm tabular-nums"
                                                >
                                                    {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                                                </span>
                                            )}
                                            
                                            <LogOutButton />
                                            
                                        </SheetClose>
                                    )}

                                    {isGuest && authNavItems.map((item) => (
                                        <SheetClose
                                            key={item.label}
                                            render={<Link to={item.href} className="text-base"/>}
                                        >
                                            {item.label}
                                        </SheetClose>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}