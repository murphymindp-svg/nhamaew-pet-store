// Review Types
export interface Review {
    review_id: string;
    product_id: string;
    product_name: string;
    product_item_id: string;
    product_item_name: string;
    product_item_quantity_id: string | null;
    product_item_quantity_name: string | null;
    product_quantity_id: string | null;
    product_quantity_name: string | null;
    review_by: string;
    review_quality: string;
    review_value: string;
    review_desc: string;
    review_rating: number;
    review_date: string;
    review_time: string;
    file_list: ReviewFile[];
}

export interface ReviewFile {
    uuid: string;
    product_id: string | null;
    seq: number | null;
    name: string;
    name_origin: string;
    file_type: string;
    mime_type: string;
    file_size_kb: number;
    file_size_mb: number;
    file_size_gb: number;
    url: string;
}

export interface ReviewsData {
    content?: Review[];
    first: boolean;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size?: string;
    empty: boolean;
}

// Review Summary for product pages
export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        [key: number]: number; // rating (1-5) -> count
    };
} 