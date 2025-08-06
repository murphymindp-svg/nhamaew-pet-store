import React from 'react';
import { useProductReviews, useInfiniteProductReviews } from '@/lib/react-query/review';
import ReviewCard from './ReviewCard';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductReviewsProps {
    productId: string;
    pageSize?: number;
}

// Option 1: Regular pagination with page numbers
export const ProductReviews: React.FC<ProductReviewsProps> = ({
    productId,
    pageSize = 10
}) => {
    const [currentPage, setCurrentPage] = React.useState(0);

    const {
        data,
        isLoading,
        isError,
        error
    } = useProductReviews({
        productId,
        page: currentPage,
        size: pageSize
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading reviews...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">
                    Error loading reviews: {error?.message}
                </p>
            </div>
        );
    }

    const reviews = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;

    if (reviews.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">No reviews found for this product.</p>
            </div>
        );
    }

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Product Reviews</h2>
                <span className="text-sm text-gray-500">
                    {totalElements} total reviews
                </span>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-lg border divide-y divide-gray-200">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.review_id}
                        review={review}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <Button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                    </span>

                    <Button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages - 1}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

// Option 2: Infinite scrolling reviews
export const InfiniteProductReviews: React.FC<ProductReviewsProps> = ({
    productId,
    pageSize = 10
}) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteProductReviews({
        productId,
        size: pageSize
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading reviews...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">
                    Error loading reviews: {error?.message}
                </p>
            </div>
        );
    }

    const allReviews = data?.pages.flatMap(page => page.content || []) || [];
    const totalElements = data?.pages[0]?.totalElements || 0;

    if (allReviews.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">No reviews found for this product.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Product Reviews</h2>
                <span className="text-sm text-gray-500">
                    {totalElements} total reviews
                </span>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-lg border divide-y divide-gray-200">
                {allReviews.map((review) => (
                    <ReviewCard
                        key={review.review_id}
                        review={review}
                    />
                ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
                <div className="text-center">
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        variant="outline"
                        className="px-6 py-2"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                Loading more reviews...
                            </>
                        ) : (
                            'Load More Reviews'
                        )}
                    </Button>
                </div>
            )}

            {/* Progress indicator */}
            <div className="text-center text-sm text-gray-500">
                Showing {allReviews.length} of {totalElements} reviews
            </div>
        </div>
    );
};

// Option 3: Auto-loading with Intersection Observer
export const AutoLoadProductReviews: React.FC<ProductReviewsProps> = ({
    productId,
    pageSize = 10
}) => {
    const loadMoreRef = React.useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteProductReviews({
        productId,
        size: pageSize
    });

    // Auto-load more when scroll to bottom
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading reviews...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">
                    Error loading reviews: {error?.message}
                </p>
            </div>
        );
    }

    const allReviews = data?.pages.flatMap(page => page.content || []) || [];
    const totalElements = data?.pages[0]?.totalElements || 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Product Reviews</h2>
                <span className="text-sm text-gray-500">
                    {totalElements} total reviews
                </span>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-lg border divide-y divide-gray-200">
                {allReviews.map((review) => (
                    <ReviewCard
                        key={review.review_id}
                        review={review}
                    />
                ))}
            </div>

            {/* Auto-load trigger and loading indicator */}
            <div ref={loadMoreRef} className="text-center p-4">
                {isFetchingNextPage && (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading more reviews...</span>
                    </div>
                )}
                {!hasNextPage && allReviews.length > 0 && (
                    <p className="text-gray-500">No more reviews to load</p>
                )}
                {allReviews.length === 0 && (
                    <p className="text-gray-500">No reviews found for this product.</p>
                )}
            </div>

            {/* Progress indicator */}
            <div className="text-center text-sm text-gray-500">
                Showing {allReviews.length} of {totalElements} reviews
            </div>
        </div>
    );
}; 