

import DeskCraftLogo from "@/assets/dc-full-logo-white.png";
import { Link } from "react-router-dom";



const exploreFooter = [
    {label: "Shop By Need", href: "#shop-by-need"},
    {label: "Featured", href: "#featured"},
    {label: "Workspace Bundles", href: "#workspace-bundles"},
    {label: "AI Workspace Assistant", href:"#ai-assistant"},
]

const accountFooter = [
    {label: "Log in", href:"/login"},
    {label: "Create account", href: "/register"}
]



export function CustomerFooter() {
    return(
        <section className=" border-y border-border bg-primary text-primary-foreground ">
            <div className="grid grid-cols-1 lg:grid-cols-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-section py-10 sm:py-12 lg:py-section gap-5">
                <div className="flex flex-col p-5 lg:col-span-2">
                    <div className="mb-4">
                        <img src={DeskCraftLogo} className="h-9" />
                        
                    </div>
                    <p className="mb-2 text-lg tracking-tight font-semibold text-primary-foreground/60">
                        Build a Workspace that works for you.
                    </p>
                    <p className="text-sm text-primary-foreground/60 mt-2 leading-6">
                        Ergonomic chairs, desks and workspace essentials selected for comfort, focus and better workdays.
                    </p>
                </div>
                
                <div className="p-5">
                    <div className="mb-4 tracking-tight font-semibold">Explore</div>
                    {exploreFooter.map((item) => (
                        <div className="text-sm text-primary-foreground/60 mb-2">
                            <a key={item.label} href={item.href} className="hover:text-primary-foreground/90 transition-all duration-300">{item.label}</a>
                        </div>
                    ))}
                </div>

                <div className="p-5">
                    <div className="mb-4 tracking-tight font-semibold">Account</div>
                    {accountFooter.map((item) => (
                        <div className="text-sm text-primary-foreground/60 mb-2">
                            <Link to={item.href} key={item.label} className="hover:text-primary-foreground/90 transition-all duration-300">{item.label}</Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-section">
                
                <div className="p-5">
                    <p className="text-sm text-primary-foreground/60">&copy; 2026 DeskCraft. All rights reserved.</p>
                </div>
            </div>

        </section>
    )
}