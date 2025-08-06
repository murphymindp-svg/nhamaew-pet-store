import { ProductCategoryResponse } from "@/types/category";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
/**
 * API function to fetch getCategories (no hooks)
 * @returns Promise with getCategories
 */
export const getCategories = async (params: { animalType: string }) => {
    try {
        const { data } = await api.post<ProductCategoryResponse>(`/api/pet-store/v1/products-category-all`, {
            animalType: params.animalType
        });

        return data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw error;
    }
};


/**
 * Custom hook to fetch product list using React Query
 * @returns useQuery result with product list
 */
export const useCategories = (params: { animalType: string; }) => {

    const defaultParams = {
        animalType: params.animalType,
    };

    return useQuery<ProductCategoryResponse>({
        queryKey: ["getCategories", defaultParams],
        queryFn: () => getCategories(defaultParams),
        enabled: !!params.animalType && params.animalType !== "",
        gcTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};