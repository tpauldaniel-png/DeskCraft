import { Button } from "@/components/ui/button";




type WorkspaceBundle = {
    name: string;
    label: string;
    benefit: string;
    price: number;
    saving: number;
    products: string[],
    imageUrl: string;
}

const developerBundle : WorkspaceBundle[] = [
    {
        name: "Developer Performance Bundle",
        label: "4-Piece Bundle",
        benefit: "Designed for long Coding Session",
        price: 59999,
        saving: 7497,
        products: ["Elevate Sit-Stand Desk", "Atlas Ergonomic chair", "Arc Dual Monitor arm", "Focus Erognomic footrest"],
        imageUrl: "/images/landing-page/bundle/developer-bundle.png",
    }
];


const workspaceBundles : WorkspaceBundle[] = [
    {
        name: "Study Starter Bundle",
        label: "4-Piece Bundle",
        benefit: "A focused and affordable study setup",
        price: 24999,
        saving: 5474,
        products: ["Compact desk", "Study chair", "Laptop stand", "Task lamp"],
        imageUrl: "/images/landing-page/bundle/study-bundle.png",
    },
    {
        name: "Home Office Comfort Bundle",
        label: "4-Piece Bundle",
        benefit: "Comfort for meetings and everyday remote work",
        price: 38999,
        saving: 6247,
        products: ["Desk", "upholstered erognomic chair", "monitor arm", "meeting light"],
        imageUrl: "/images/landing-page/bundle/office-bundle.png",
    }
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});


export function WorkspaceBundleSection() {
    return(
        <section className="bg-background py-10 sm:py-12 lg:py-section" id="workspace-bundles">
            <div className="px-4 sm:px-6 lg:px-section mx-auto max-w-7xl w-full">
                <div className="mb-8 max-w-2xl sm:mb-10">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Complete Workspace Bundles
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                        Everything you need for a comfortable, coordinated workspace-selected to work better together.
                    </p>
                </div>

                <div className="mb-4">
                    {developerBundle.map((item) => (
                        <article 
                            key={item.name}
                            className="group grid grid-cols-1 bg-card shadow-sm border border-border h-full overflow-hidden
                                rounded-2xl transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1
                                hover:border-primary/30 hover:shadow-md lg:grid-cols-2" 
                        >
                            <div className="h-64 overflow-hidden bg-secondary sm:h-80 lg:h-auto md:min-h-100">
                                <img 
                                    src={item.imageUrl}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"

                                />
                            </div>

                            <div className="flex flex-col p-5 items-start sm:p-6 lg:p-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-warm">{item.label}</p>
                                <h3 className="text-xl font-semibold tracking-tight text-foreground mt-3 sm:text-2xl">
                                    {item.name}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                                    {item.benefit}
                                </p>

                                <p className="mt-5 text-sm font-semibold text-foreground">Includes: </p>

                                <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                                    {item.products.map((product) => (
                                        <li className="flex gap-2 text-sm leading-5 text-muted-foreground" key={product}>
                                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"/>
                                            <span>{product}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6">
                                    <p className="text-lg font-semibold text-primary">
                                        Bundle Price: {currencyFormatter.format(item.price)}
                                    </p>
                                    
                                    
                                    <p className="mt-1 text-sm font-semibold text-brand-warm">
                                        Saving: {currencyFormatter.format(item.saving)}
                                    </p>
                                </div>

                                <div className="mt-auto w-full pt-6">
                                    <Button
                                        type="button"
                                        className="w-full sm:w-fit"    
                                    >
                                        View Bundle
                                    </Button>
                                </div>
                            </div>
                            
                            
                        </article>

                        
                    ))}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-6 lg:gap-6">
                    {workspaceBundles.map((item) => (
                        <article
                            key={item.name}
                            className="group bg-card shadow-sm border border-border h-full overflow-hidden
                                rounded-2xl transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1
                                hover:border-primary/30 hover:shadow-md flex flex-col"
                        >
                            <div className="relative aspect-3/2 overflow-hidden bg-secondary">
                                <img 
                                    src={item.imageUrl}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"

                                />
                            </div>

                            <div className="flex flex-col flex-1 p-5 items-start sm:p-6">

                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-warm">
                                    {item.label}
                                </p>
                                
                                <h3 className="text-lg font-semibold tracking-tight text-foreground mt-3">
                                    {item.name}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {item.benefit}
                                </p>

                                <p className="mt-5 text-sm font-semibold text-foreground">Includes: </p>

                                <ul className="mt-3 space-y-2">
                                    {item.products.map((product) => (
                                        <li
                                            key={product}
                                            className="flex gap-2 text-sm leading-5 text-muted-foreground"
                                        >
                                            <span 
                                                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                                            />

                                            <span>{product}</span>
                                        </li>
                                    ))}
                                </ul>

                                

                                
                                <div className="mt-6">
                                    <p className="text-lg font-semibold text-primary">
                                        Bundle Price: {currencyFormatter.format(item.price)}
                                    </p>
                                    
                                    
                                    <p className="mt-1 text-sm font-semibold text-brand-warm">
                                        Saving: {currencyFormatter.format(item.saving)}
                                    </p>
                                </div>

                                <div className="mt-auto w-full pt-6">
                                    <Button
                                        type="button"
                                        className="w-full sm:w-fit"    
                                    >
                                        View Bundle
                                    </Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

