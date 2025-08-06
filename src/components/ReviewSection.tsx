import { Star, ChevronRight } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { Button } from './ui/Button';
import { Review } from '@/types/review';

interface ReviewSectionProps {
    productRating: number;
    reviews: Review[];
    onViewAllReviews?: () => void;
    onReviewClick?: (reviewIndex: number) => void;
    className?: string;
}

const ReviewSection = ({
    productRating,
    reviews,
    onViewAllReviews,
    onReviewClick,
    className = ''
}: ReviewSectionProps) => {
    return (
        <div className={`bg-white ${className}`}>
            {/* Review Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-light cursor-pointer" onClick={onViewAllReviews}>
                <div className="flex items-center gap-x-2 text-lg lg:text-xl font-semibold">
                    <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-warning text-warning" />
                    <span>{productRating.toFixed(1)}</span>
                    <span>คะแนนสินค้า</span>
                </div>
                <button
                    type="button"
                    className="flex items-center hover:text-primary transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Reviews List */}
            <div className="divide-y divide-gray-light">
                {reviews.map((review, index) => (
                    <ReviewCard
                        key={review.review_id}
                        review={review}
                        onClick={onReviewClick ? () => onReviewClick(index) : undefined}
                    />
                ))}
            </div>

            {/* View All Reviews Button */}
            {reviews.length > 0 && (
                <div className="flex justify-center p-4 border-t border-gray-light cursor-pointer" onClick={onViewAllReviews}>
                    <Button
                        variant="link"
                        rightIcon={<ChevronRight className="w-4 h-4 text-primary" />}
                        className="hover:text-primary-hover transition-colors text-sm lg:text-base"
                    >
                        ดูรีวิวอื่นๆ
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ReviewSection; 