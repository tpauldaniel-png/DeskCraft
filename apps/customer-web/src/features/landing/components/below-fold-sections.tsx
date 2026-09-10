import { AiAssistantSection } from "./ai-assistant-section";
import { CategorySection } from "./category-section";
import { CustomerFooter } from "./customer-footer";
import { FeaturedProductsSection } from "./featured-products-section";
import { TrustSection } from "./trust-us-section";
import { WorkspaceBundleSection } from "./workspace-bundle-section";


export function BelowFoldSections() {
    return(
        <>
            <CategorySection />
            <AiAssistantSection />
            <FeaturedProductsSection />
            <WorkspaceBundleSection />
            <TrustSection />
            <CustomerFooter />  
        </>
    );
}