// Export all filter related constants and types
export * from './filters';

// Export all category related constants and types  
export * from './categories';

// Export all mock data and types
export * from './mockData';

// Re-export commonly used items for convenience
export {
    PRODUCT_FILTER_OPTIONS,
    GENDER_OPTIONS,
    ProductSortType,
    GenderType,
    PetType,
    getProductFilterLabels,
    filters
} from './filters';

export {
    CATEGORIES,
    getAllCategories,
    getCategoryById
} from './categories';

export {
    MOCK_PRODUCTS,
    HERO_SLIDES,
    getProductById,
    getPopularProducts,
    getAllSlides
} from './mockData'; 