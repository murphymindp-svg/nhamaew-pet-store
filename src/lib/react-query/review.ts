import { Review, ReviewsData } from "@/types/review";
import api from "@/utils/api";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

/**
 * API function to fetch product reviews (no hooks)
 * @returns Promise with product reviews list
 */
export const getProductReviews = async (params: { productId: string; page: number; size: number }) => {
    try {
        const { data } = await api.post<ReviewsData>(`/api/pet-store/v1/review-product`, {
            productId: params.productId,
            page: params.page ?? 0,
            size: params.size ?? 10
        });

        return data;
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
    }
};

/**
 * Custom hook to fetch product reviews using React Query
 * @returns useQuery result with product reviews list
 */
export const useProductReviews = (params: { productId: string; page: number; size: number }) => {
    const defaultParams = {
        productId: params.productId,
        page: params.page ?? 0,
        size: params.size ?? 10
    };

    return useQuery<ReviewsData>({
        queryKey: ["getProductReviews", defaultParams],
        queryFn: () => getProductReviews(defaultParams),
        gcTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: !!params.productId, // Only run when productId is provided
    });
};

/**
 * Custom hook to fetch infinite product reviews using React Query
 * @returns useInfiniteQuery result with product reviews list
 */
export const useInfiniteProductReviews = (params: { productId: string; size: number }) => {
    const defaultParams = {
        productId: params.productId,
        size: params.size ?? 10
    };

    return useInfiniteQuery({
        queryKey: ["getInfiniteProductReviews", defaultParams],
        queryFn: ({ pageParam = 0 }) => getProductReviews({ ...defaultParams, page: pageParam as number }),
        getNextPageParam: (lastPage, allPages) => {
            // If it's the last page, return undefined to stop fetching
            if (lastPage.last) {
                return undefined;
            }
            // Return the next page number (current page + 1)
            return allPages.length;
        },
        initialPageParam: 0,
        gcTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: !!params.productId, // Only run when productId is provided
    });
};
