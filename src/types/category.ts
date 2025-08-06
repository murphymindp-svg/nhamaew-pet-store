export interface ProductCategory {
    id: number;
    detail: string;
    is_delete: boolean;
    is_all: boolean;
    category_level: number;
    list: ProductCategory[];
}

export interface ProductCategoryResponse {
    productsCategoryList: ProductCategory[];
}