export interface MyCartData {
    id: number;
    productId: string;
    productItemId: string;
    productName: string;
    productItemName: string;
    productItemQuantityName: string | null;
    productQuantityName: string | null;
    productItemQuantityId: string | null;
    productQuantityId: string | null;
    imageUrl: string;
    price: number;
    originalPrice: number;
    quantity: number;
}

export interface MyCartCountResponse {
    total: number;
}


export interface AddItemToCart {
    lineUserId: string,
    productItemId: string,
    productItemQuantityId: string,
    productQuantityId: string,
    quantity: number,
}

export interface DeleteCartItem {
    id: number;
}

export interface UpdateCartItemQuantity {
    id: number;
    lineUserId: string;
    quantity: number;
}

// Order related types
export interface OrderItem {
    productItemId: string;
    productItemQuantityId: string;
    productQuantityId: string;
    quantity: number;
}

export interface CreateOrderRequest {
    lineUserId: string;
    orderItemList: OrderItem[];
}

export interface CreateOrderResponse {
    success: boolean;
    orderId?: string;
    message?: string;
    // Add other response fields as needed based on API response
}

// Get Order types
export interface GetOrderRequest {
    lineUserId: string;
}

export interface OrderHistoryItem {
    id: number;
    productId: string;
    productItemId: string | null;
    productName: string;
    productItemName: string | null;
    productItemQuantityName: string | null;
    productQuantityName: string | null;
    productItemQuantityId: string | null;
    productQuantityId: string | null;
    imageUrl: string;
    price: number;
    quantity: number;
}

export interface OrderHistoryResponse {
    id: string;
    orderCode: string;
    status: string;
    transactionDate: string;
    orderItemList: OrderHistoryItem[];
}

export type GetOrderResponse = OrderHistoryResponse[];