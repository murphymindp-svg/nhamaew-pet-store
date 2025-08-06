// Product Types
export interface Product {
    id?: string;
    name?: string;
    imageUrl?: string;
    price?: string;
    originalPrice?: string;
    rating?: string;
    sold?: string;
    forPets?: string[];
}

export interface ProductsData {
    content?: Product[];
    first: boolean;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size?: string;
    empty: boolean;
}

export interface ProductDetail {
    productId: string;
    productUrl: string;
    productName: string;
    priceRange: string;
    productDetails?: string;
    productSuitableFor?: string;
    ingredients?: string;
    nutritionalInfo?: string;
    recommend?: string;
    otherRecommend?: string;
    cautions?: string;
    otherProductInfo?: string;
    frequentlyAskedQuestions?: string;
    sold?: string;
    originalPrice?: string;
    price?: string;
    productBalance?: string;
    averageReviewScore?: number;
    isFavorite: boolean;
    fileList?: FileList[];
    typeSizeList: TypeSizeList[];
    quantityList: QuantityListItem[];
}

export interface FileList {
    productId: string;
    name: string;
    nameOrigin: string;
    url: string;
    fileType: string;
    mimeType: string;
}

export interface FileData {
    uuid: string | null;
    name: string | null;
    name_origin: string | null;
    file_type: string;
    mime_type: string | null;
    file_size_kb: number;
    file_size_mb: number;
    file_size_gb: number;
    url: string;
}

export interface QuantityListItem {
    productQuantityId: string;
    productId: string;
    productQuantityName: string;
    productQuantity: number;
    price: number;
    percentDiscount: number | null;
    discountPrice: number;
    status: "AVAILABLE" | "UNAVAILABLE" | "OUT_OF_STOCK";
    file: FileData;
    showDelete: boolean;
    delete: boolean;
}

export interface TypeSizeList {
    productItemId: string;
    productId: string;
    productItemName: string;
    typeSize: string;
    price: number | null;
    percentDiscount: number | null;
    discountPrice: number;
    status: "AVAILABLE" | "UNAVAILABLE" | "OUT_OF_STOCK";
    sku: string | null;
    file: FileData;
    quantityList: QuantityListItem[];
    delete: boolean;
    showDelete: boolean;
}

export interface ProductCategory {
    id: number;
    detail: string;
    is_delete: boolean;
    is_all: boolean;
    category_level: number;
    list: ProductCategory[];
}

export interface ProductCategoryResponse {
    productsCategoryList: ProductCategory[] | [];
}