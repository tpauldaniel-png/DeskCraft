

type CategorySectionProps = {
    imageUrl: string;
    label: string;
}


const CategoryCards : CategorySectionProps[] = [
    {imageUrl: "/images/landing-page/category/chair.png", label: "Chairs"},
    {imageUrl: "/images/landing-page/category/desk.png", label: "Desks"},
    {imageUrl: "/images/landing-page/category/accessories.png", label: "Accessories"},
    {imageUrl: "/images/landing-page/category/bundle.png", label: "Workspace bundles"}

]





export function CategorySection() {
    return(
        <section className="bg-background py-10 sm:py-12 lg:py-section">
            <div className="px-4 sm:px-6 lg:px-section mx-auto max-w-7xl">

                <div className="mb-8 max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Explore Products
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                        Find a product suits your workspace.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:gap-6">
                    {CategoryCards.map((item) => (
                        <article 
                            key={item.label}
                            className="group bg-card shadow-sm border border-border flex flex-col h-full overflow-hidden
                                rounded-2xl transition-[transform, box-shadow, border-color] duration-300 hover:-translate-y-1
                                hover:border-primary/30 hover:shadow-md"
                        >
                            <div className="aspect-3/3 overflow-hidden bg-muted">
                                <img src={item.imageUrl} alt="" className="object-cover w-full h-full transition-transform duration-500"/>
                            </div>

                            <div className="flex flex-1 flex-col p-5 ">
                                <h3 className="text-sm tracking-tight font-semibold text-foreground ">{item.label}</h3>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    )
}