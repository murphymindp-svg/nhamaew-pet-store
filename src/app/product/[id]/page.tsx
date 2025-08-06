'use client';

import { useParams, useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronLeft, Star, Heart, MessageCircle, ChevronRight, Share, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getProductById, getReviewsByProductId } from '@/constants/mockData'
import ReviewSection from '@/components/ReviewSection'
import ProductAccordion from '@/components/ProductAccordion'
import RelatedProducts from '@/components/RelatedProducts'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import ModalBottom from '@/components/common/ModalBottom';
import ProductSelect from '@/components/ProductSelect';
import ReviewsModal from '@/components/common/ReviewsModal';
import ImageViewer from '@/components/common/ImageViewer';
import { swal } from '@/components/common/SweetAlert';
import { useProductDetail } from '@/lib/react-query/product';
import Loading from '@/components/common/Loading';
import { ProductDetail } from '@/types/product';
import { useUpdateProductFavourite } from '@/lib/react-query/favourite';
import { useAddItemToCart } from '@/lib/react-query/cart';
import { useSession } from 'next-auth/react';
import { useProductReviews } from '@/lib/react-query/review';
import { useChatWithAdmin } from '@/lib/react-query/chat';
import useLiff from '@/hooks/useLiff';

export default function ProductDetailPage() {


    const { id } = useParams();
    const { closeWindow } = useLiff();
    const { data: session } = useSession();
    const { data: productDetail, isLoading: productDetailLoading, refetch: productDetailRefetch } = useProductDetail({ productid: id as string, lineUserId: session?.user?.id ?? "" });
    const {
        data: reviewsData,
        isLoading: reviewsLoading,
        isError,
        error
    } = useProductReviews({
        productId: productDetail?.productId ?? "",
        page: 0,
        size: 2
    });

    const { mutate: updateFavourite } = useUpdateProductFavourite();
    const { mutate: addItemToCart } = useAddItemToCart();
    const { mutate: initiateChatWithAdmin, isPending: chatLoading } = useChatWithAdmin();

    const { push } = useRouter();
    const pathname = usePathname();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalAddtoCart, setModalAddtoCart] = useState(false);
    const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [imageViewerIndex, setImageViewerIndex] = useState(0);
    const [reviewScrollIndex, setReviewScrollIndex] = useState<number | undefined>(undefined);


    // Helper function to detect video files
    const isVideo = (file: { fileType?: string; mimeType?: string; url?: string }) => {
        if (file.mimeType && file.mimeType.startsWith('video/')) return true;
        if (file.fileType && file.fileType.toLowerCase().includes('video')) return true;
        if (file.url) {
            const url = file.url.toLowerCase();
            return url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg') || url.includes('.mov') || url.includes('.avi');
        }
        return false;
    };

    // Get media URLs for ImageViewer
    const handleImageClick = (index: number) => {
        setImageViewerIndex(index);
        setImageViewerOpen(true);
    };

    // Add event listeners for pagination thumbnail clicks and reset scroll position
    useEffect(() => {
        const handlePaginationClick = (event: Event) => {
            const target = event.target as HTMLElement;
            const paginationItem = target.closest('[data-index]') as HTMLElement;
            if (paginationItem) {
                const index = parseInt(paginationItem.getAttribute('data-index') || '0', 10);
                handleImageClick(index);
            }
        };

        const paginationElement = document.querySelector('.swiper-custom-pagination');
        if (paginationElement) {
            paginationElement.addEventListener('click', handlePaginationClick);
            // Reset scroll position to show index 0 first
            paginationElement.scrollLeft = 0;
        }

        return () => {
            if (paginationElement) {
                paginationElement.removeEventListener('click', handlePaginationClick);
            }
        };
    }, [productDetail?.fileList]);

    // Sync pagination scroll with current image index
    useEffect(() => {
        const paginationElement = document.querySelector('.swiper-custom-pagination');
        const activeItem = paginationElement?.querySelector(`[data-index="${currentImageIndex}"]`) as HTMLElement;

        if (paginationElement && activeItem) {
            const containerRect = paginationElement.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();

            // Check if item is visible in the container
            const itemLeft = itemRect.left - containerRect.left + paginationElement.scrollLeft;
            const itemRight = itemLeft + itemRect.width;
            const containerScrollLeft = paginationElement.scrollLeft;
            const containerScrollRight = containerScrollLeft + containerRect.width;

            // If item is not fully visible, scroll to make it visible
            if (itemLeft < containerScrollLeft) {
                // Item is hidden on the left, scroll left
                paginationElement.scrollTo({
                    left: itemLeft - 8, // Add some margin
                    behavior: 'smooth'
                });
            } else if (itemRight > containerScrollRight) {
                // Item is hidden on the right, scroll right
                paginationElement.scrollTo({
                    left: itemRight - containerRect.width + 8, // Add some margin
                    behavior: 'smooth'
                });
            }
        }
    }, [currentImageIndex, productDetail?.fileList]);

    // const handleBackClick = () => {
    //     router.back();
    // };

    const handleShare = () => {
        // Implement share functionality
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        navigator.share?.({
            title: productDetail?.productName ?? "",
            text: `ดูสินค้านี้ ${productDetail?.productName ?? ""}`,
            url: "https://liff.line.me/" + liffId + "/product/" + id,
        });
    };

    const handleFavorite = () => {
        updateFavourite({
            lineUserId: session?.user?.id ?? "",
            productId: productDetail?.productId ?? "",
            isFavorite: !productDetail?.isFavorite
        }, {
            onSuccess() {
                productDetailRefetch();
            }
        });
    };

    const handleViewAllReviews = () => {
        setReviewScrollIndex(undefined); // Reset scroll index when viewing all reviews
        setReviewsModalOpen(true);
    };

    const handleReviewClick = (reviewIndex: number) => {
        setReviewScrollIndex(reviewIndex);
        setReviewsModalOpen(true);
    };

    const handleChatWithAdmin = () => {

        if (!session?.user?.id || !productDetail?.productId) {
            // Redirect to login if not authenticated
            push(`/auth/auto-signin?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }
        swal.fire({
            icon: "warning",
            title: "หน้านี้จะถูกปิดลงและพาคุณกลับไปที่ไลน์เพื่อแชทกับแอดมิน",
            confirmButtonText: "ตกลง",
            showDenyButton: true,
            denyButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                // Open chat URL after user confirms
                initiateChatWithAdmin({
                    lineUserId: session.user.id,
                    productId: productDetail.productId
                }, {
                    onSuccess: (response) => {
                        closeWindow();
                    },
                    onError: (error) => {
                        swal.fire({
                            icon: "error",
                            title: "เกิดข้อผิดพลาด",
                            text: "ไม่สามารถเชื่อมต่อแชทได้ กรุณาลองใหม่อีกครั้ง",
                        });
                    }
                });
            }
        });
    };

    const pagination = {
        clickable: true,
        el: '.swiper-custom-pagination',
        renderBullet: function (index: number, className: string) {
            const file = productDetail?.fileList?.[index];
            const isVideoFile = file ? isVideo(file) : false;
            const playIconHtml = isVideoFile ?
                '<div class="absolute inset-0 flex items-center justify-center"><div class="bg-black/60 rounded-full p-1"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div></div>' :
                '';

            return `<span class="${className} !w-14 !h-14 !rounded-[14px] !bg-white border !border-gray-light cursor-pointer relative group flex-shrink-0" data-index="${index}">
                ${isVideoFile ?
                    `<video src="${file?.url}" class="!rounded-[14px] w-full h-full object-cover" />`
                    :
                    `<img src="${file?.url}" class="!rounded-[14px] w-full h-full object-cover" />`
                }
                ${playIconHtml}
            </span>`;
        },
    };

    if (productDetailLoading) return <Loading fullscreen />

    return (
        <div className='pb-20'>

            {/* section product */}
            <div className='bg-white '>
                <div className='lg:container mx-auto space-y-8 lg:pt-8 lg:px-5 px-0'>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                        {/* Product Images Section */}
                        <div className="relative order-1 lg:order-1">
                            <div className="relative">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    navigation={{
                                        nextEl: '.swiper-button-next-custom',
                                        prevEl: '.swiper-button-prev-custom',
                                    }}
                                    loop={true}
                                    className="aspect-square product-swiper"
                                    onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
                                    pagination={pagination}
                                >
                                    {productDetail?.fileList?.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div
                                                className="aspect-square bg-white flex items-center justify-center lg:border lg:rounded-[20px] lg:border-gray-light cursor-pointer relative group"
                                                onClick={() => handleImageClick(index)}
                                            >
                                                {
                                                    isVideo(image) ?
                                                        <video src={image.url} className="w-full h-full object-contain lg:border lg:rounded-[20px]" />
                                                        :
                                                        <img
                                                            src={image.url}
                                                            alt={`${image.name}`}
                                                            className="w-full h-full object-contain lg:border lg:rounded-[20px]"
                                                        />
                                                }
                                                {/* Video Play Icon Overlay */}
                                                {isVideo(image) && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-200 lg:border lg:rounded-[20px]">
                                                        <div className="bg-black/60 rounded-full p-4 group-hover:bg-black/80 transition-all duration-200">
                                                            <Play className="w-8 h-8 text-white fill-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Image Counter */}
                                <div className="absolute bottom-5 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-20">
                                    {currentImageIndex + 1}/{productDetail?.fileList?.length || 0}
                                </div>

                                {/* Custom Navigation Buttons */}
                                {(productDetail?.fileList?.length || 0) > 1 && (
                                    <>
                                        <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 bg-secondary text-white p-2 rounded-full z-10 hover:bg-black/40 transition-colors">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 bg-secondary text-white p-2 rounded-full z-10 hover:bg-black/40 transition-colors">
                                            <ChevronLeft className="w-5 h-5 rotate-180" />
                                        </button>
                                    </>
                                )}
                            </div>
                            {/* Custom Pagination */}
                            <div className="swiper-custom-pagination !hidden lg:!flex justify-start mt-4 overflow-x-auto pb-2 flex-nowrap gap-2 max-w-full"
                                style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
                            </div>
                        </div>

                        {/* Product Information Section */}
                        <div className="order-2 lg:order-2 space-y-4 lg:space-y-6">
                            {/* Product Name & Price */}
                            <div className="bg-white px-4 lg:px-6">
                                {/* Price Section - Mobile First */}
                                <div className="mb-4 lg:mb-6 lg:order-2">
                                    <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
                                        <span className="text-2xl lg:text-3xl font-semibold text-primary">฿{productDetail?.price ?? "0"}</span>
                                        {productDetail?.originalPrice && (
                                            <span className="text-xs text-disabled line-through">฿{productDetail?.originalPrice}</span>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center justify-between space-x-2 mb-3 lg:mb-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center py-2">
                                                <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-warning text-warning" />
                                                <span className="text-sm lg:text-base text-black ml-1 lg:ml-2">{productDetail?.averageReviewScore?.toFixed(1)}</span>
                                                <span className="text-sm lg:text-base text-gray-light mx-1 lg:mx-2">|</span>
                                                <span className="text-xs lg:text-base text-black">ขายแล้ว {productDetail?.sold} ชิ้น</span>
                                            </div>
                                            <span className="text-xs md:text-sm text-subdube">ยอดขายและรีวิวจากทุกช่องทางการจัดจำหน่าย</span>
                                        </div>
                                        <button type='button' className='flex items-center space-x-2' onClick={handleViewAllReviews}>
                                            <span className="text-sm md:text-base lg:text-lg text-secondary whitespace-nowrap">
                                                ดูรีวิว
                                            </span>
                                            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Name - Mobile After Price */}
                                <h1 className="text-lg lg:text-xl font-semibold lg:font-semibold text-black mb-4 lg:mb-6 leading-6 lg:leading-7 lg:order-1">
                                    {productDetail?.productName}
                                </h1>

                                {/* Action Icons */}
                                <div className="flex items-center justify-between pb-3 lg:pb-6 mb-4 lg:mb-6 border-b border-gray-light lg:order-3">
                                    <div className="flex items-center space-x-4 lg:space-x-6">
                                        <button
                                            onClick={handleShare}
                                            className="flex flex-col justify-center items-center text-secondary hover:text-primary transition-colors"
                                        >
                                            <Share className="w-5 h-5 lg:w-6 lg:h-6" />
                                            <span className="text-sm mt-1">แชร์</span>
                                        </button>
                                        <button
                                            onClick={handleFavorite}
                                            className="flex flex-col justify-center items-center text-gray-600 hover:text-primary transition-colors"
                                        >
                                            <Heart className={`w-5 h-5 lg:w-6 lg:h-6 ${productDetail?.isFavorite ? 'fill-primary text-primary' : ''}`} />
                                            <span className="text-sm mt-1">ถูกใจ</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="bg-white p-4 lg:p-6">
                                <div className="space-y-4">
                                    {/* Guarantee */}
                                    <div className="flex items-start space-x-3">
                                        <img src="/icons/detail-safety.svg" alt="safety" className="w-5 h-5 lg:w-6 lg:h-6" />
                                        <span className="text-sm lg:text-base text-gray-800">ปลอดภัย รับประกันสินค้าของแท้ 100%</span>
                                    </div>

                                    {/* Venter */}
                                    <div className="flex items-start space-x-3">
                                        <img src="/icons/detail-venter.svg" alt="venter" className="w-5 h-5 lg:w-6 lg:h-6" />
                                        <span className="text-sm lg:text-base text-gray-800">
                                            ทุกขั้นตอนการจัดจำหน่าย อยู่ภายใต้การดูแลของสัตวแพทย์มืออาชีพ
                                        </span>
                                    </div>

                                    {/* Consult */}
                                    <div className="flex items-start space-x-3">
                                        <img src="/icons/detail-consult.svg" alt="consult" className="w-5 h-5 lg:w-6 lg:h-6" />
                                        <span className="text-sm lg:text-base text-gray-800">ปรึกษาสัตวแพทย์ฟรีเกี่ยวกับสินค้าและการใช้สินค้า</span>
                                    </div>

                                    {/* Teams */}
                                    <div className="flex items-start space-x-3">
                                        <img src="/icons/detail-team.svg" alt="team" className="w-5 h-5 lg:w-6 lg:h-6" />
                                        <div className="text-sm lg:text-base text-gray-800">
                                            <div>ทีมสัตว์แพทย์จากบริษัท CSR VET GROUP CO., LTD. ประสบการณ์ด้านผลิตภัณฑ์สำหรับสัตว์เลี้ยงมากกว่า 7 ปี
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping */}
                                    <div className="flex items-start space-x-3">
                                        <img src="/icons/detail-delivery.svg" alt="delivery" className="w-5 h-5 lg:w-6 lg:h-6" />
                                        <span className="text-sm lg:text-base text-gray-800">จัดส่งสินค้าทุกวัน เมื่อสั่งซื้อก่อน 14.00 น.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Reviews Section */}
                    <div className="w-full">
                        {
                            reviewsLoading ? <Loading /> :
                                <ReviewSection
                                    productRating={productDetail?.averageReviewScore ?? 0}
                                    reviews={reviewsData?.content ?? []}
                                    onViewAllReviews={handleViewAllReviews}
                                    onReviewClick={handleReviewClick}
                                    className="mt-2 lg:mt-6"
                                />
                        }
                    </div>

                    {/* Product Accordion */}
                    <div className="w-full mt-4">
                        <ProductAccordion
                            productDetails={productDetail as ProductDetail}
                        />
                    </div>
                </div>
            </div>

            <RelatedProducts
                currentProductId={productDetail?.productId ?? ""}
            />

            <div className="z-[1000] fixed bottom-0 left-0 right-0 bg-white border-t border-gray-light p-4">
                <div className="lg:container mx-auto">
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            className="flex lg:flex-initial flex-1 bg-gray-600 hover:bg-gray-700 border-gray-600 lg:min-w-[140px]"
                            leftIcon={<MessageCircle className="w-4 h-4" />}
                            onClick={handleChatWithAdmin}
                            disabled={chatLoading}
                        >
                            แชทสอบถาม
                        </Button>
                        <Button
                            variant="default"
                            className="lg:flex-initial flex-1 bg-primary hover:bg-primary-hover border-primary lg:min-w-[360px]"
                            onClick={() => {
                                if (session) setModalAddtoCart(true)
                                else push(`/auth/auto-signin?callbackUrl=${encodeURIComponent(pathname)}`)
                            }}
                        >
                            ดูตัวเลือกสินค้านี้
                        </Button>
                    </div>
                </div>
            </div>

            {/* Product Selection Modal */}
            <ModalBottom
                open={modalAddtoCart}
                onClose={() => setModalAddtoCart(false)}
                header="ตัวเลือกสินค้า"
                size="lg"
                zIndex='z-[1001]'
            >
                <ProductSelect
                    id={productDetail?.productId ?? ''}
                    productDetail={productDetail as ProductDetail}
                    onClose={() => setModalAddtoCart(false)}
                    onAddToCart={(selectedOptions) => {
                        addItemToCart(selectedOptions, {
                            onSuccess() {
                                swal.fire({
                                    icon: "success",
                                    title: "เพิ่มสินค้าไปยังตะกร้าเรียบร้อย",
                                    text: "คุณต้องการดำเนินการอย่างไรต่อ",
                                    confirmButtonText: "ตรวจสอบสินค้าในตะกร้า",
                                    denyButtonText: "เลือกซื้อสินค้าต่อ",
                                    showDenyButton: true,

                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        push('/my-cart')
                                    }
                                    setModalAddtoCart(false);
                                });
                            }
                        })
                    }}
                />
            </ModalBottom>

            {/* Reviews Modal */}
            <ReviewsModal
                open={reviewsModalOpen}
                onClose={() => setReviewsModalOpen(false)}
                productRating={productDetail?.averageReviewScore ?? 0}
                productId={productDetail?.productId ?? ""}
                productName={productDetail?.productName ?? ""}
                initialScrollIndex={reviewScrollIndex}
            />

        </div>
    );
}
