import { ShippingAddress, UpdateShippingAddressRequest } from "@/types/address";
import api from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * API function to fetch getMyAddressData (no hooks)
 * @returns Promise with getMyAddressData
 */
export const getShippingAddressData = async (params: { lineUserId: string }) => {
    try {
        const { data } = await api.post<ShippingAddress>(`/api/pet-store/v1/get-shipping-address`, {
            lineUserId: params.lineUserId
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
export const useShippingAddress = (params: { lineUserId: string; }) => {

    const defaultParams = {
        lineUserId: params.lineUserId,
    };

    return useQuery<ShippingAddress>({
        queryKey: ["getShippingAddress", defaultParams],
        queryFn: () => getShippingAddressData(defaultParams),
        enabled: !!params.lineUserId && params.lineUserId !== "",
        gcTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Interface for updating shipping address request
 */

/**
 * API function to update shipping address (no hooks)
 * @returns Promise with updated shipping address data
 */
export const updateShippingAddressData = async (params: UpdateShippingAddressRequest) => {
    try {
        const { data } = await api.put<ShippingAddress>(`/api/pet-store/v1/update-shipping-address`, params);

        return data;
    } catch (error) {
        console.error('Error updating shipping address:', error);
        throw error;
    }
};

/**
 * Custom hook to update shipping address using React Query mutation
 * @returns useMutation result for updating shipping address
 */
export const useUpdateShippingAddress = () => {
    const queryClient = useQueryClient();

    return useMutation<ShippingAddress, Error, UpdateShippingAddressRequest>({
        mutationFn: updateShippingAddressData,
        onSuccess: (data, variables) => {
            // Invalidate and refetch shipping address queries
            queryClient.invalidateQueries({
                queryKey: ["getShippingAddress"],
            });
            // You can also update the cache directly if needed
            queryClient.setQueryData(
                ["getShippingAddress", { lineUserId: variables.lineUserId }],
                data
            );
        },
        onError: (error) => {
            console.error('Failed to update shipping address:', error);
        },
    });
};

