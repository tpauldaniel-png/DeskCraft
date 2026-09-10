




export function AiAssistantSection() {
    return(
        <section className="px-4 sm:px-6 lg:px-section py-10 sm:py-12 lg:py-section bg-background scroll-mt-20 mx-auto max-w-7xl w-full" id="ai-assistant">
            <div className="grid grid-cols-1 lg:grid-cols-2 group bg-card shadow-sm border border-border h-full overflow-hidden
                        rounded-2xl transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1
                        hover:border-primary/30 hover:shadow-md">
                
                

                <div className="flex flex-col p-5 items-start sm:p-6 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-warm">YOUR PERSONAL WORKSPACE GUIDE</p>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground mt-3 sm:text-2xl">
                        Not sure what fits your space?
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                        Tell us about your work, available space and budget. 
                        The DeskCraft assistant will recommend a coordinated ergonomic workspace for you.
                    </p>

                    <p className="mt-3 text-sm sm:text-base ">
                        AI assistant coming soon...
                    </p>
                </div>

                <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                    <img 
                        src="/images/landing-page/ai-assistant.webp"
                        alt="DeskCraft assistant showing personalized workspace recommendations"
                        width={1448}
                        height={1086}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                </div>
            </div>
        </section>
    )
}

