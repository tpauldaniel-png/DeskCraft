import { Button } from "@/components/ui/button"

import { Link } from "react-router-dom";




export function HeroSection() {
    return(
        <section className="min-h-560px  relative w-full overflow-hidden md:min-h-620px lg:min-h-650px">

            <picture className="absolute inset-0">
                

                <source media="(min-width: 768px)" srcSet="/images/landing-page/hero/hero-pic5.webp" />

                <img src="/images/landing-page/hero/hero-pic4.webp" alt="" fetchPriority="high" width={960} height={540} className="h-full w-full object-cover object-top-right md:object-[60%_center] lg:object-center" />
            </picture>

            
            <div className="absolute inset-0 bg-primary/40 md:bg-primary/20 lg:bg-transparent" />





            <div className= " relative z-10 mx-auto flex min-h-560px max-w-7xl items-center px-4 py-12 sm:px-6 md:min-h-620px lg:min-h-650px lg:px-8 ">
                <div className="max-w-md">
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-background/80 lg:text-slate-700 ">
                        Complete workspace solutions
                    </p>

                    <h1 className="text-4xl font-semibold text-background leading-tight sm:text-5xl lg:text-7xl lg:text-primary">
                        Build a workspace that works for you.
                    </h1>

                    <p className="mt-6 max-w-md text-base leading-7 text-background/90 sm:text-lg lg:text-slate-50"> 
                        Ergonomic furniture and accessories thoughtfully selected 
                        for comfort, posture and focus.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button className="bg-background text-primary  lg:bg-primary lg:text-primary-foreground" render={<a href="#shop-by-need"/>}>
                            Shop by need
                        </Button>

                        <Button className="border-background/70 bg-transparent lg:bg-background  text-background  lg:border-input lg:text-primary" render={<Link to="#ai-assistant"/>} variant="outline">
                            Find your setup
                        </Button>
                    </div>
                </div>
            </div>
            
        </section>
    )
}