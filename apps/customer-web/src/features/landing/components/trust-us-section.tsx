import { Armchair,PackageCheck, ShieldCheck, Truck } from "lucide-react";




const trustItems = [
    {
        icon: Armchair,
        title: "Erognomic Selection",
        description: "Products selected to support comfort, posture and focused work."
    },
    {
        icon: PackageCheck,
        title: "Coordinated Workspaces",
        description: "Furniture and accessories thoughtfully designed to work together."
    },
    {
        icon: ShieldCheck,
        title: "Secure Checkout",
        description: "Payments protected through a trusted payment provider."
    },
    {
        icon: Truck,
        title: "Order Tracking",
        description: "Follow your order from confirmation through delivery."
    },
];

export function TrustSection() {
    return (
        <section className="border-y border-border bg-secondary/40">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-section py-10 sm:py-12 lg:py-section">
                <h2>
                    Why shop with DeskCraft?
                </h2>

                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-5">
                    {trustItems.map((item) => {
                        const Icon = item.icon;
                        return(
                            <li
                                key={item.title}
                                className="flex items-start gap-4"
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon 
                                        className="size-5"
                                    />

                                </div>

                                <div>
                                    <h3 className="text-sm text-foreground font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}