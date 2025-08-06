// API Response Types

export interface Banner {
    id: number;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}


export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface BannersResponse extends ApiResponse<Banner[]> { }

// Error types
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
} 