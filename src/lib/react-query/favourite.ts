import { ShippingAddress, UpdateShippingAddressRequest } from "@/types/address";
import { UpdateProductFavouriteRequest } from "@/types/favourite";
import { ProductsData } from "@/types/product";
import api from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * API function to fetch getMyAddressData (no hooks)
 * @returns Promise with getMyAddressData
 */
export const getFavouriteData = async (params: { lineUserId: string; page: number; size: number }) => {
    try {
        const { data } = await api.post<ProductsData>(`/api/pet-store/v1/get-favorites`, {
            lineUserId: params.lineUserId,
            page: params.page ?? 0,
            size: params.size ?? 10,
        });

        return data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw error;
    }
};

/**
 * Custom hook to fetch useMyAddress using React Query
 * @returns useQuery result with useMyAddress
 */
export const useFavourites = (params: { lineUserId: string; page: number; size: number }) => {

    const defaultParams = {
        lineUserId: params.lineUserId,
        page: params.page ?? 0,
        size: params.size ?? 10,
    };

    return useQuery<ProductsData>({
        queryKey: ["getFavouriteData", defaultParams],
        queryFn: () => getFavouriteData(defaultParams),
        enabled: !!params.lineUserId && params.lineUserId !== "",
        gcTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Interface for updating product favourite request
 */

/**
 * API function to update product favourite (no hooks)
 * @returns Promise with updated  product favourite data
 */
export const updateProductFavourite = async (params: UpdateProductFavouriteRequest) => {
    try {
        const { data } = await api.put<UpdateProductFavouriteRequest>(`/api/pet-store/v1/update-favorites`, params);

        return data;
    } catch (error) {
        console.error('Error updating shipping address:', error);
        throw error;
    }
};

/**
 * Custom hook to update product favourite using React Query mutation
 * @returns useMutation result for updating product favourite
 */
export const useUpdateProductFavourite = () => {
    const queryClient = useQueryClient();

    return useMutation<UpdateProductFavouriteRequest, Error, UpdateProductFavouriteRequest>({
        mutationFn: updateProductFavourite,
        onSuccess: (data, variables) => {
            // Invalidate and refetch shipping address queries
            queryClient.invalidateQueries({
                queryKey: ["getFavouriteData",],
            });
            queryClient.invalidateQueries({
                queryKey: ["getProductDetail",],
            });
        },
        onError: (error) => {
            console.error('Failed to update shipping address:', error);
        },
    });
};