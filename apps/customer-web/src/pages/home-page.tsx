import { CategorySection } from "@/features/landing/components/category-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { ShopByNeedSection } from "@/features/landing/components/shop-by-need-section";




export function HomePage() {

    return (
        <>
            <HeroSection />
            <ShopByNeedSection />
            <CategorySection />
        </>
        
    );
}