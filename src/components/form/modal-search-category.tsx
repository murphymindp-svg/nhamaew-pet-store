import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { Button } from "../ui/Button";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "../common/Loading";
import { useCategories } from "@/lib/react-query/category";
import { ProductCategory } from "@/types/category";

export type SearchCategoryModalProps = {
    animalType: string;
    name: string;
    open: boolean;
    onClose: () => void;
};

export function SearchCategoryModal({ animalType, name, open, onClose }: SearchCategoryModalProps) {

    const { push } = useRouter();
    const [currentCategory, setCurrentCategory] = useState<ProductCategory | null>(null);
    const [currentCategories, setCurrentCategories] = useState<ProductCategory[]>([]);
    const [navigationStack, setNavigationStack] = useState<{ category: ProductCategory | null, categories: ProductCategory[] }[]>([]);

    const {
        data: categories,
        isLoading: categoriesLoading,
        refetch: categoriesRefetch
    } = useCategories({
        animalType: animalType
    });

    // Update category when props change
    useEffect(() => {
        if (open && categories?.productsCategoryList) {
            setCurrentCategory(null);
            setCurrentCategories(categories.productsCategoryList || []);
            setNavigationStack([]);
        }
    }, [open, categories]);

    const handleSubcategoryClick = async (subcategory: ProductCategory) => {
        if (subcategory.list && subcategory.list.length > 0) {
            // Navigate to subcategory - push current state to stack
            setNavigationStack(prev => [...prev, { category: currentCategory, categories: currentCategories }]);
            setCurrentCategory(subcategory);
            setCurrentCategories(subcategory.list);
        } else {
            // This is a leaf category - navigate to search
            // const searchtext = subcategory.detail || '';
            // push(`/search?searchtext=${encodeURIComponent(searchtext)}`);
            push(`/search?category=${encodeURIComponent(subcategory.id)}`);
            onClose();
        }
    };

    const handleBackClick = async () => {
        if (navigationStack.length > 0) {
            // Pop the last state from stack
            const previousState = navigationStack[navigationStack.length - 1];
            const newStack = navigationStack.slice(0, -1);

            setNavigationStack(newStack);
            setCurrentCategory(previousState.category);
            setCurrentCategories(previousState.categories || []);
        }
    };

    const handleViewAllProducts = () => {
        const searchtext = currentCategory?.detail || name || '';
        const category = currentCategory?.id || categories?.productsCategoryList[0].id || '';
        // push(`/search?searchtext=${encodeURIComponent(searchtext)}`);
        push(`/search?category=${encodeURIComponent(category ?? '')}`);
        onClose();
    };

    const getCurrentLevelName = () => {
        if (currentCategory?.detail) {
            return currentCategory.detail;
        }
        return name || 'หมวดหมู่สินค้า';
    };

    const getPreviousCategoryName = () => {
        if (navigationStack.length > 0) {
            const previousState = navigationStack[navigationStack.length - 1];
            return previousState.category?.detail || name || 'หมวดหมู่สินค้า';
        }
        return name || 'หมวดหมู่สินค้า';
    };

    return (
        <Modal open={open} onClose={onClose} header="หมวดหมู่สินค้า" size="md">
            <div className="flex flex-col h-screen  md:mb-0 sm:mb-20 mb-80">
                {/* Back Navigation - Moved to Top */}
                {navigationStack.length > 0 && (
                    <div className="flex items-center justify-between px-0 pb-2 mb-4">
                        <button
                            onClick={handleBackClick}
                            className="flex items-center space-x-3 text-primary hover:text-primary-dark transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-base font-medium">{getPreviousCategoryName()}</span>
                        </button>
                    </div>
                )}

                {/* Current Category Header */}
                <div className="flex items-center justify-between bg-primary-light rounded-full p-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <p className="text-black font-semibold text-base">{getCurrentLevelName()}</p>
                    </div>
                    <Button size="sm" onClick={handleViewAllProducts} className="text-sm">
                        ดูสินค้าทั้งหมด
                    </Button>
                </div>

                {/* Subcategories List */}
                <div className="flex-1 h-full">
                    {categoriesLoading && (
                        <div className="text-center py-8">
                            <Loading />
                        </div>
                    )}

                    {!categoriesLoading && currentCategories && currentCategories.length > 0 && (
                        <div className="space-y-0">
                            {currentCategories.map((subcategory, index) => {
                                // Safety check to ensure subcategory is valid
                                if (!subcategory || subcategory.is_all === true) {
                                    return null;
                                }

                                return (
                                    <button
                                        key={`${subcategory.id}-${index}`}
                                        onClick={() => handleSubcategoryClick(subcategory)}
                                        className="w-full grid grid-cols-[1fr_auto] items-center gap-4 py-4 px-0 md:px-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <span className="text-black text-base font-semibold">
                                            {subcategory.detail || 'ไม่มีชื่อ'}
                                        </span>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <span className="text-base text-secondary whitespace-nowrap">
                                                ดูเพิ่มเติม
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!categoriesLoading && (!currentCategories || currentCategories.length === 0) && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">ไม่พบหมวดหมู่ย่อย</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
