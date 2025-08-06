// Filter Types และ Enums
export enum ProductSortType {
    BEST_SELLING = 'BSP',
    LATEST = 'LP',
    PRICE_LOW_TO_HIGH = 'ASC',
    PRICE_HIGH_TO_LOW = 'DESC'
}

export enum GenderType {
    DEFAULT = '',
    MALE = 'M',
    FEMALE = 'F',
    OTHER = 'N'
}

export enum PetType {
    CAT = 'cat',
    DOG = 'dog',
    RABBIT = 'rabbit',
    BIRD = 'bird'
}

// Filter Options
export const PRODUCT_FILTER_OPTIONS = [
    {
        label: 'สินค้าขายดี',
        value: ProductSortType.BEST_SELLING
    },
    {
        label: 'ล่าสุด',
        value: ProductSortType.LATEST
    },
    {
        label: 'ราคาต่ำ>สูง',
        value: ProductSortType.PRICE_LOW_TO_HIGH
    },
    {
        label: 'ราคาสูง>ต่ำ',
        value: ProductSortType.PRICE_HIGH_TO_LOW
    }
] as const;

export const GENDER_OPTIONS = [
    {
        label: 'เลือกเพศ',
        value: GenderType.DEFAULT
    },
    {
        label: 'ชาย',
        value: GenderType.MALE
    },
    {
        label: 'หญิง',
        value: GenderType.FEMALE
    },
    {
        label: 'ไม่ระบุ',
        value: GenderType.OTHER
    }
];

// Helper functions
export const getProductFilterLabels = () => PRODUCT_FILTER_OPTIONS.map(option => option);

export const getProductFilterByValue = (value: ProductSortType) =>
    PRODUCT_FILTER_OPTIONS.find(option => option.value === value);

export const getGenderByValue = (value: GenderType) =>
    GENDER_OPTIONS.find(option => option.value === value);

// Legacy support - สำหรับ backward compatibility
export const filters = getProductFilterLabels();

// Type exports
export type ProductFilterOption = typeof PRODUCT_FILTER_OPTIONS[number];
export type GenderOption = typeof GENDER_OPTIONS[number]; 