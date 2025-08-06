import { BannerAndCategoryData } from "@/types/banner";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

/**
 * API function to fetch banners (no hooks)
 * @returns Promise with banners data
 */
export const getBannersAndCategory = async () => {
    try {
        const { data } = await api.get<BannerAndCategoryData>(`/api/pet-store/v1/get-banners`);
        return data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw error;
    }
};

/**
 * Custom hook to fetch banners using React Query
 * @returns useQuery result with banners data
 */
export const useBannersAndCategory = () => {
    return useQuery<BannerAndCategoryData>({
        queryKey: ["getBannersAndCategory"],
        queryFn: getBannersAndCategory,
        gcTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};