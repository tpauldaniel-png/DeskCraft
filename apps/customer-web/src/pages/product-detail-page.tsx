import { isAxiosError } from "axios";
import { useProductDetail } from "@/features/catalogue/hooks/use-products";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb,BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ProductDetailContent } from "@/features/catalogue/components/product-detail-content";
import { ProductSpecifications } from "@/features/catalogue/components/product-specifications";
import { RelatedProductsSection } from "@/features/catalogue/components/related-products-section";

export function ProductDetailPage() {

    const {slug} = useParams<{slug: string}>();
    const productDetailQuery = useProductDetail(slug);
    

    if (productDetailQuery.isLoading) {
        return(
            <div
                role="status"
                className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
            >   
                Loading product details...
            </div>
        )
    }

    if (productDetailQuery.isError) {
        const notFound = 
            isAxiosError(productDetailQuery.error) &&
            productDetailQuery.error.response?.status === 404;

        return(
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold">
                    {notFound ? "Product not found" : "Unable to load product details. Please try again later."}
                </h1>

                <div className="flex items-center gap-4">
                    <Link to="/products" className="text-primary hover:underline">
                        Back to Products
                    </Link>

                    {!notFound && (
                        <Button
                            disabled={productDetailQuery.isFetching}
                            variant="outline"
                            size="sm"
                            onClick={() => productDetailQuery.refetch()}
                        >
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    const product = productDetailQuery.data;

    if (!product) {
        return(
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold">
                    Product not found
                </h1>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl w-full space-y-8 px-4 py-8 sm:px-6  lg:px-8 lg:py-12">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link to={"/"} />}>
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link to={"/products"} />}>
                            Shop
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbPage className="wrap-break-word">
                            {product.name}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <ProductDetailContent product={product} />
            <ProductSpecifications specifications={product.specifications} />
            <RelatedProductsSection categoryId={product.category_id} currentProductId={product.product_id}/>
        </div>
    );
}