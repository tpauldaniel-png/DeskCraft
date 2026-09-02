import DeskCraftLogo from "@/assets/DeskCraft-logo.png";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";




type NavItemsProps = {
    label: string,
    href: string,
}

const navItems : NavItemsProps[] = [
    {label: "Home", href: "/"},
    {label: "Shop by Need", href: "#shop-by-need"},
    {label: "Featured", href: "#featured"},
    {label: "AI Workspace Assistant", href:"#ai-assistant"},
    
]

const authNavItems: NavItemsProps[] = [
    {label: "Log in", href: "/login"},
    {label: "Create account", href: "/register"}
]





export function CustomerHeader() {
    return (
        <header>
            <div className="border-b border-border bg-card ">
                <div className="mx-auto flex h-16 items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="w-10 h-10 object-contain">
                        <a href="/">
                            <img src={DeskCraftLogo} alt="" />
                        </a>
                        
                    </div>

                    <nav className="mx-auto gap-10 hidden items-center md:flex">
                        {navItems.map((item) => (
                            <a key={item.label} href={item.href}>{item.label}</a>
                        ))}
                    </nav>

                    <nav className="hidden items-end gap-5 md:flex">
                        {authNavItems.map((item) => (
                            <Link to={item.href} key={item.label}>{item.label}</Link>
                        ))}
                    </nav>

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
                                                <a href={item.href} className="text-base"/>
                                            }
                                        >
                                            {item.label}
                                        </SheetClose>
                                    ))}

                                    <div className="border-t" />

                                    {authNavItems.map((item) => (
                                        <SheetClose
                                            key={item.label}
                                            render={
                                                <Link to={item.href} className="text-base" />
                                            }
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