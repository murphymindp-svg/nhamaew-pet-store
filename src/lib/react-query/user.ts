import { RegisterUpdateProfileRequest, RegisterUpdateProfileResponse, GetLineProfileResponse, LineProfileData } from "@/types/user";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * API function to get LINE profile (no hooks)
 * @param lineUserId - LINE user ID
 * @returns Promise with LINE profile response
 */
export const getLineProfile = async (lineUserId: string) => {
    try {
        const { data } = await api.get<LineProfileData>(`/api/pet-store/v1/get-line-profile/${lineUserId}`, {});
        return data;
    } catch (error) {
        console.error('Error fetching LINE profile:', error);
        throw error;
    }
};

/**
 * Custom hook to get LINE profile using React Query
 * @param lineUserId - LINE user ID
 * @returns useQuery result for LINE profile
 */
export const useLineProfile = (lineUserId: string) => {
    return useQuery<LineProfileData>({
        queryKey: ["userProfile", lineUserId],
        queryFn: () => getLineProfile(lineUserId),
        enabled: !!lineUserId, // Only run query if lineUserId is provided
        gcTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * API function to register/update user profile (no hooks)
 * @param params - Profile data to update
 * @returns Promise with updated profile response
 */
export const registerUpdateProfile = async (params: RegisterUpdateProfileRequest) => {
    try {
        // Remove keys with null values before sending
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== null)
        );
        const { data } = await api.post<RegisterUpdateProfileResponse>(`/api/pet-store/v1/register-update-profile`, filteredParams);

        return data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Custom hook to register/update user profile using React Query mutation
 * @returns useMutation result for updating user profile
 */
export const useRegisterUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<RegisterUpdateProfileResponse, Error, RegisterUpdateProfileRequest>({
        mutationFn: registerUpdateProfile,
        onSuccess: (data, variables) => {
            // Invalidate and refetch user-related queries
            queryClient.invalidateQueries({
                queryKey: ["userProfile"],
            });
            console.log('Profile updated successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to update user profile:', error);
        },
    });
};
