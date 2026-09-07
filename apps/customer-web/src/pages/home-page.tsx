import { CategorySection } from "@/features/landing/components/category-section";
import { FeaturedProductsSection } from "@/features/landing/components/featured-products-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { ShopByNeedSection } from "@/features/landing/components/shop-by-need-section";
import { WorkspaceBundleSection } from "@/features/landing/components/workspace-bundle-section";




export function HomePage() {

    return (
        <>
            <HeroSection />
            <ShopByNeedSection />
            <CategorySection />
            <FeaturedProductsSection />
            <WorkspaceBundleSection />
        </>
        
    );
}