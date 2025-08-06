import { PetType } from './filters';

// Category Types
export interface Category {
    id: number;
    name: string;
    imageUrl: string;
    alt: string;
    petType: PetType;
    route?: string;
}

// Categories Constants
export const CATEGORIES: Category[] = [
    {
        id: 1,
        name: 'น้องแมว',
        imageUrl: '/images/cate-cat-demo.png',
        alt: 'Cat products',
        petType: PetType.CAT,
        route: '/products/cat'
    },
    {
        id: 2,
        name: 'น้องหมา',
        imageUrl: '/images/cate-dog-demo.png',
        alt: 'Dog products',
        petType: PetType.DOG,
        route: '/products/dog'
    }
];

// Helper functions
export const getCategoryById = (id: number): Category | undefined =>
    CATEGORIES.find(category => category.id === id);

export const getCategoriesByPetType = (petType: PetType): Category[] =>
    CATEGORIES.filter(category => category.petType === petType);

export const getAllCategories = (): Category[] => CATEGORIES; 