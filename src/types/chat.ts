export interface ChatAdminRequest {
    lineUserId: string;
    productId?: string;
}

export interface ChatAdminResponse {
    message?: string;
    success: boolean;
    chatUrl?: string;
    // Add other response fields as needed based on actual API response
} 