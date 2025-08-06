import React, { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { useInfiniteInterestingProducts, useProducts } from '@/lib/react-query/product';
import Loading from './common/Loading';
import { Product } from '@/types/product';

interface RelatedProductsProps {
    currentProductId: string;
    className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
    currentProductId,
    className = ''
}) => {

    const {
        data: productList,
        isLoading: productsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteInterestingProducts({
        productId: currentProductId,
        size: 6,
    });

    const allProducts: Product[] = productList?.pages.flatMap(page => page.content ?? []) ?? [];

    // Intersection Observer for infinite loading
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <>
            <div className='md:bg-white bg-gray-light'>
                <div className='lg:container mx-auto space-y-8 lg:pt-8 lg:px-5 px-0'>
                    <h2 className="py-4 text-lg lg:text-xl font-semibold text-black lg:mb-6 mb-4 px-4 lg:bg-white bg-gray-light">
                        สินค้าอื่นๆที่คุณอาจสนใจ
                    </h2>
                </div>
            </div>

            <div className={`bg-gray-light h-full rounded-lg  ${className}`}>
                <div className='lg:container mx-auto space-y-8 lg:pt-8 pb-5 lg:px-5 px-0'>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 px-3">
                        {
                            productsLoading ? <Loading className='w-full col-span-4' /> :
                                allProducts.length > 0 ? (
                                    allProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-gray-500 text-lg">ไม่พบสินค้าที่ค้นหา</p>
                                        <p className="text-gray-400 text-sm mt-2">ลองเปลี่ยนคำค้นหาหรือตัวกรองดู</p>
                                    </div>
                                )
                        }
                    </div>

                    {/* Intersection Observer Target */}
                    <div ref={loadMoreRef} className="h-10 w-full" />

                    {/* Load More Indicator */}
                    {isFetchingNextPage && (
                        <div className="flex justify-center mt-6 w-full px-3">
                            <Loading className='w-full' />
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default RelatedProducts; 