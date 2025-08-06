export interface ShippingAddress {
    recipientFullName: string;
    recipientPhoneNumber: string;
    shippingAddress: string;
    additionalAddress: string;
}

export interface UpdateShippingAddressRequest {
    lineUserId: string;
    recipientFullName: string;
    recipientPhoneNumber: string;
    shippingAddress: string;
    additionalAddress: string;
}
