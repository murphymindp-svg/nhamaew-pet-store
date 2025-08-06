import { PetType } from './filters';

// Product Types
export interface Product {
    id: number;
    name: string;
    rating: number;
    reviews: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    petTypes?: PetType[];
    category?: string;
    isPopular?: boolean;
    isNew?: boolean;
    sku?: string;
    description?: string;
    instructions?: string;
    suitableFor?: string;
    ingredients?: string;
    additionalInfo?: Record<string, string>;
}

// Hero Slider Types
export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    alt: string;
    ctaText?: string;
    ctaLink?: string;
}

// Mock Products Data
export const MOCK_PRODUCTS: Product[] = [...Array(10)].map((_, i) => ({
    id: i + 1,
    name: 'O3vit 50 ml อาหารเสริมยันต์ไข่ สำหรับแมว/สุนัข กำจัดสวย แฮนเรง มิดแล้ว เสริมภูมิ ขนาด 50 ml.',
    rating: 5.0,
    reviews: '9.3พัน',
    price: 1050,
    originalPrice: 1250,
    imageUrl: `/images/product-demo.png`,
    petTypes: [PetType.DOG, PetType.CAT],
    category: 'อาหารเสริม',
    isPopular: i % 3 === 0,
    isNew: i % 4 === 0,
    sku: '01 08 59 0005',
    description: 'อาหารเสริมสำหรับสัตว์เลี้ยง O3vit เป็นผลิตภัณฑ์ที่ช่วยบำรุงสุขภาพและเสริมภูมิคุ้มกันให้แข็งแรง เหมาะสำหรับแมวและสุนัขทุกวัย',
    instructions: 'ให้กินวันละ 1 ml / น้ำหนัก แมว/สุนัข 1 กก. กินพร้อมอาหารหรือผสมในอาหาร',
    suitableFor: 'เหมาะสำหรับแมวและสุนัขอายุ 3 เดือนขึ้นไป',
    ingredients: 'วิตามินรวม, น้ำมันปลา, โอเมก้า 3, 6, 9, แร่ธาตุ, และสารอาหารจำเป็น',
    additionalInfo: {
        '4': 'ช่วยเสริมสร้างภูมิคุ้มกัน ลดการเกิดโรคผิวหนัง ขนร่วง และส่งเสริมการเจริญเติบโต',
        '5': 'ให้ผลลัพธ์ที่ดีภายใน 2-4 สัปดาห์หลังการใช้อย่างต่อเนื่อง',
        '6': 'ได้รับการรับรองคุณภาพมาตรฐานจากกรมปศุสัตว์',
        '7': 'ผลิตโดยทีมสัตวแพทย์ที่มีประสบการณ์กว่า 7 ปี',
        '8': 'สินค้ามีอายุการใช้งาน 2 ปีหลังจากวันผลิต',
        '9': 'มีบริการให้คำปรึกษาฟรีหลังการซื้อสินค้า'
    }
}));

// Hero Slides Data
export const HERO_SLIDES: HeroSlide[] = [
    {
        id: 1,
        title: 'PETS PARADISE',
        subtitle: 'have everything for pet lover!',
        imageUrl: 'https://placehold.co/1200x400/FFD700/FFFFFF?text=Pet+Paradise',
        alt: 'Pet promotion',
        ctaText: 'ช้อปเลย',
        ctaLink: '/products'
    },
    {
        id: 2,
        title: 'SALE UP TO 30% OFF',
        subtitle: 'for all cat food brands!',
        imageUrl: 'https://placehold.co/1200x400/3498DB/FFFFFF?text=Cat+Food+Sale',
        alt: 'Cat food sale',
        ctaText: 'ดูสินค้าลดราคา',
        ctaLink: '/sale'
    },
    {
        id: 3,
        title: 'NEW ARRIVALS',
        subtitle: 'check out the latest dog toys!',
        imageUrl: 'https://placehold.co/1200x400/2ECC71/FFFFFF?text=New+Dog+Toys',
        alt: 'New dog toys',
        ctaText: 'ดูสินค้าใหม่',
        ctaLink: '/products?filter=new'
    }
];

// Helper functions for products
export const getProductById = (id: number): Product | undefined =>
    MOCK_PRODUCTS.find(product => product.id === id);

export const getProductsByPetType = (petType: PetType): Product[] =>
    MOCK_PRODUCTS.filter(product =>
        product.petTypes?.includes(petType)
    );

export const getPopularProducts = (): Product[] =>
    MOCK_PRODUCTS.filter(product => product.isPopular);

export const getNewProducts = (): Product[] =>
    MOCK_PRODUCTS.filter(product => product.isNew);

export const searchProducts = (query: string): Product[] =>
    MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
    );

// Review Types
export interface Review {
    id: string;
    rating: number;
    author: string;
    content: string;
    buyerCount: number;
    commentCount: number;
    images: string[];
}

// Mock Reviews Data
export const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        rating: 5.0,
        author: 'R*****T',
        content: 'คุณภาพผลิตภัณฑ์ที่ดีมาก ความปลอดภัยในการใช้งาน การป้องกันและการดูแล การดูแลรักษา การป้องกันเชื้อโรค การป้องกันโรคและแบคทีเรียต่างๆ',
        buyerCount: 0,
        commentCount: 0,
        images: ['/images/product-demo-rm-bg.png', '/images/product-demo-rm-bg.png', '/images/product-demo-rm-bg.png']
    },
    {
        id: '2',
        rating: 5.0,
        author: 'R*****T',
        content: 'ดีมากได้ตามที่ได้ดูจาก 25 ml\nผลิตภัณฑ์ที่ปลอดภัยให้กับเด็ก ความปลอดภัยในการใช้งาน การป้องกันและการดูแล การดูแลรักษา การป้องกันเชื้อโรค การป้องกันโรคและแล้วแต่...',
        buyerCount: 0,
        commentCount: 0,
        images: ['/images/product-demo-rm-bg.png', '/images/product-demo-rm-bg.png', '/images/product-demo-rm-bg.png', '/images/product-demo-rm-bg.png', '/images/product-demo-rm-bg.png']
    }
];

// Helper functions for reviews
export const getReviewsByProductId = (productId: number): Review[] => MOCK_REVIEWS;

// Helper functions for hero slides
export const getSlideById = (id: number): HeroSlide | undefined =>
    HERO_SLIDES.find(slide => slide.id === id);

export const getAllSlides = (): HeroSlide[] => HERO_SLIDES; 