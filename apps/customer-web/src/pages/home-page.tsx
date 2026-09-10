

import { HeroSection } from "@/features/landing/components/hero-section";
import { ShopByNeedSection } from "@/features/landing/components/shop-by-need-section";
import { lazy, Suspense } from "react";


const BelowFoldSections = lazy(async () => {
    const { BelowFoldSections } = await import("@/features/landing/components/below-fold-sections");

    return {
        default: BelowFoldSections,
    }
})


export function HomePage() {

    return (
        <>
            <HeroSection />
            <ShopByNeedSection />

            <Suspense fallback={null}>
                <BelowFoldSections />
            </Suspense>
            
        </>
        
    );
}