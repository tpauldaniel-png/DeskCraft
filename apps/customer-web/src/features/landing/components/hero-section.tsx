import { Button } from "@/components/ui/button"

import { Link } from "react-router-dom";




export function HeroSection() {
    return(
        <section className="min-h-650px bg-[url('/images/hero-pic5.png')] bg-cover bg-center bg-no-repeat w-full">
            <div className="mx-auto flex min-h-650px max-w-7xl items-center px-2 ">
                <div className="max-w-md text-[#23466A]">
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.25rem] text-slate-700 mt-8">
                        Complete workspace solutions
                    </p>

                    <h1 className="text-5xl font-semibold leading-tight lg:text-7xl text-primary">
                        Build a workspace that works for you.
                    </h1>

                    <p className="mt-6 max-w-md text-lg text-slate-50"> 
                        Ergonomic furniture and accessories thoughtfully selected 
                        for comfort, posture and focus.
                    </p>

                    <Button className="mt-8 mb-10" render={<Link to="#shop-by-need"/>}>
                        Shop by need
                    </Button>

                    <Button className="mt-8 mb-10 ml-2" render={<Link to="#ai-assistant" />}>
                        Find your setup
                    </Button>
                </div>
            </div>
            
        </section>
    )
}