import { useQuery } from "@tanstack/react-query";
import { getPublicCategories } from "../api/category-api";



export function usePublicCategories() {
    return useQuery({
        queryKey: ['catalogue','public-categories'],
        queryFn: getPublicCategories,
    });
}