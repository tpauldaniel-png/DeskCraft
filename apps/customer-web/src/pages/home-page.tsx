import { AiAssistantSection } from "@/features/landing/components/ai-assistant-section";
import { CategorySection } from "@/features/landing/components/category-section";
import { CustomerFooter } from "@/features/landing/components/customer-footer";
import { FeaturedProductsSection } from "@/features/landing/components/featured-products-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { ShopByNeedSection } from "@/features/landing/components/shop-by-need-section";
import { TrustSection } from "@/features/landing/components/trust-us-section";
import { WorkspaceBundleSection } from "@/features/landing/components/workspace-bundle-section";




export function HomePage() {

    return (
        <>
            <HeroSection />
            <ShopByNeedSection />
            <CategorySection />
            <AiAssistantSection />
            <FeaturedProductsSection />
            <WorkspaceBundleSection />
            <TrustSection />
            <CustomerFooter />
        </>
        
    );
}