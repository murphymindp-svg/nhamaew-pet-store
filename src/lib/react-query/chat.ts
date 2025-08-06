import { ChatAdminRequest, ChatAdminResponse } from "@/types/chat";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * API function to initiate chat with admin
 * @param request - Chat admin request data
 * @returns Promise with chat admin response
 */
export const chatWithAdmin = async (request: ChatAdminRequest): Promise<ChatAdminResponse> => {
    try {
        const { data } = await api.post<ChatAdminResponse>('/api/pet-store/v1/chat-admin', request);
        return data;
    } catch (error) {
        console.error('Error initiating chat with admin:', error);
        throw error;
    }
};

/**
 * Custom hook to initiate chat with admin using React Query mutation
 * @returns useMutation result for chat admin
 */
export const useChatWithAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation<ChatAdminResponse, Error, ChatAdminRequest>({
        mutationFn: chatWithAdmin,
        onSuccess: (data, variables) => {
            console.log('Chat with admin initiated successfully:', data);
            // You can add any cache invalidation or other side effects here
        },
        onError: (error) => {
            console.error('Failed to initiate chat with admin:', error);
        },
    });
}; 