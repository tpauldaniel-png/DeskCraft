import { Button } from "@/components/ui/button"


type ShopByNeedProps = {
    imageUrl: string;
    title: string;
    description: string;
}

const shopByNeedCards : ShopByNeedProps[] = [
    {imageUrl: "/images/landing-page/shop-by-need/study-setup.png", title: "Study Companion", description: "Designed for comortable and focused study session" },
    {imageUrl: "/images/landing-page/shop-by-need/developer-setup.png", title: "Developer workstation", description: "Desks, seating and accessories optimized for focused coding session"},
    {imageUrl: "/images/landing-page/shop-by-need/work-from-home-setup.png", title: "Professional Home Office", description: "A comfortable workspace for meetings and  everyday remote work"},
    {imageUrl: "/images/landing-page/shop-by-need/small-spaces-setup.png", title: "Compact Workspace", description: "Space saving essentials designed for smaller rooms"},
]   
    






export function ShopByNeedSection() {
    return(
        <section id="shop-by-need" className="scroll-mt-20 bg-background py-section">


            <div className="mx-auto max-w-7xl px-section">

                <div className="mb-8 max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Shop By Need
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                        Find a workspace designed around how and where you work.
                    </p>
                </div>

                <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

                    {shopByNeedCards.map((item) => (
                        <article key={item.title} 
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border 
                                bg-card shadow-sm transition-[transform, box-shadow, border-color] duration-300 hover:-translate-y-1 
                                hover:border-primary/30 hover:shadow-md focus-within:ring-ring focus-within:ring-2"
                        >
                            <div className="aspect-4/5 overflow-hidden bg-muted">
                                <img src={item.imageUrl} alt="" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-1.03" />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="text-lg tracking-tight font-semibold text-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2 leading-6">{item.description}</p>
                                <Button variant="ghost" className="mt-auto w-fit px-0 text-primary hover:bg-transparent hover:text-primary/80">Explore Setup</Button>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    )
}