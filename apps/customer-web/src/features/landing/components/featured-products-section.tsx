
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"


type FeaturedProduct = {
    slug: string;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
    imageAlt: string;
    badge?: string;
}

const featuredProducts : FeaturedProduct[] = [
    {
        slug: "elevate-sit-stand-desk",
        name: "Elevate Sit Stand Desk",
        category: "Desks",
        price: 34999,
        imageUrl: "/images/landing-page/featured/featured-desk.png",
        imageAlt: "Pale oak adjustable desk with deep navy legs",
        badge: "Bestseller"

    },
    {
        slug: "atlas-erognomic-chair",
        name: "Atlas Ergonomic Chair",
        category: "Chairs",
        price: 22499,
        imageUrl: "images/landing-page/featured/featured-chair.png",
        imageAlt: "Deep navy erognomic chair with headrest",
        badge: "Popular"
    },
    {
        slug: "arc-dual-monitor-arm",
        name: "Arc Dual Monitor arm",
        category: "Accessories",
        price: 7499,
        imageUrl: "images/landing-page/featured/featured-monitor-arm.png",
        imageAlt: "Adjustable monitor arm in clean workspace",

    },
    {
        slug: "focus-erognomic-footrest",
        name: "Focus Ergonomic Footrest",
        category: "Accessories",
        price: 3499,
        imageUrl: "images/landing-page/featured/featured-footrest.png",
        imageAlt: "Adjustable erognomic footrest in deep navy"
,
    }
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});


export function FeaturedProductsSection() {
    return(
        <section 
            id="featured"
            className="scroll-mt-20 bg-background py-10 sm:py-12 lg:py-section"
        
        >
            <div className="px-4 sm:px-6 lg:px-section mx-auto max-w-7xl">
                <div className="mb-8 max-w-2xl sm:mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                        Customer Favourites
                    </p>

                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Featured Products
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                        Thougtfully selected essentials for healthier and more comfortable workspace
                    </p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: false
                    }}
                >
                    <CarouselContent>
                        
                            {featuredProducts.map((product) => (
                                <CarouselItem 
                                    key={product.name}
                                    className="flex basis-[88%] sm:basis-1/2 lg:basis-1/4 py-3"
                                >
                                    <article
                                        key={product.slug}
                                        className="group bg-card shadow-sm border border-border flex flex-col h-full overflow-hidden
                                            rounded-2xl transition-[transform, box-shadow, border-color] duration-300 hover:-translate-y-1
                                            hover:border-primary/30 hover:shadow-md"
                                    >
                                        <div className="relative aspect-4/5 overflow-hidden bg-secondary">
                                            {product.badge && (
                                                <span 
                                                className="absolute rounded-full left-3 top-3 z-10 bg-primary px-3 py-1 text-xs font-medium
                                                    text-primary-foreground">
                                                    {product.badge}
                                                </span>
                                            )}

                                            <img 
                                                src={product.imageUrl}
                                                alt={product.imageAlt}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500"
                                            
                                            />

                                            
                                        </div>

                                        <div className="flex flex-1 flex-col p-5 ">
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                {product.category}
                                            </p>

                                            <h3 className="text-lg font-semibold tracking-tight text-foreground mt-2">
                                                {product.name}
                                            </h3>
                                            
                                            <p className="mt-3 text-sm lg:text-base lg:font-semibold text-primary">
                                                {currencyFormatter.format(product.price)}
                                            </p>
                                        </div>
                                    </article>
                                </CarouselItem>
                            ))}
                        
                    </CarouselContent>
                    
                    <div className="mt-6 flex justify-end gap-3 lg:hidden">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>

                </Carousel>
            </div>

        </section>
    )
}