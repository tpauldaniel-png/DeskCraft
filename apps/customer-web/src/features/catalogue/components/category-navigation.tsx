
import { Link } from "react-router-dom";
import type { PublicCategory } from "../types/category";


type CategoryNavigationProps = {
    categories: PublicCategory[];
    activeCategoryId?: string;
};


export function CategoryNavigation({ categories, activeCategoryId }: CategoryNavigationProps) {

    const baseClass = "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-primary/10 hover:text-primary";
    const activeClass = "bg-primary text-primary-foreground border-primary";
    const inactiveClass = "bg-card text-foreground border-border hover:bg-primary/20 hover:text-primary";

    return (
        <nav className="flex flex-wrap gap-2">
            <Link to="/products"
                className={`${baseClass} ${!activeCategoryId ? activeClass : inactiveClass}`}
            >
                All Products
            </Link>
            {categories.map((category) => (
                <Link key={category.category_id} to={`/products?category_id=${category.category_id}`}
                    className={`${baseClass} ${activeCategoryId === category.category_id ? activeClass : inactiveClass}`}
                >
                    {category.name}
                </Link>
            ))}
        </nav>
    )
}