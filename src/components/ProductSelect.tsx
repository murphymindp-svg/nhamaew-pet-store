'use client';

import React, { useState } from 'react'
import { Button } from './ui/Button';
import Image from 'next/image'
import { Maximize2, Minus, Plus } from 'lucide-react';
import { ProductDetail } from '@/types/product';
import ImageViewer from "@/components/common/ImageViewer"; // adjust path if needed
import { AddItemToCart } from '@/types/cart';
import { useSession } from 'next-auth/react';

const ProductSelect = ({ id, productDetail, onClose, onAddToCart }: { id: string, productDetail: ProductDetail, onClose: () => void, onAddToCart?: (selectedOptions: AddItemToCart) => void }) => {

    const [selectedType, setSelectedType] = useState<string>(productDetail.typeSizeList?.[0]?.productItemId ?? '');
    const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(0);
    const [selectedPackage, setSelectedPackage] = useState<string>(productDetail.typeSizeList?.[0]?.quantityList[0]?.productQuantityId ?? "");
    const [selectedPackageQuantity, setSelectedPackageQuantity] = useState<string>(productDetail.quantityList?.[0]?.productQuantityId ?? "");

    const [quantity, setQuantity] = useState(1);
    const [viewerOpen, setViewerOpen] = useState(false);

    const { data: session } = useSession();


    // Add to cart function
    const handleAddToCart = () => {
        const cartItem: AddItemToCart = {
            lineUserId: session?.user?.id ?? "",
            productItemId: selectedType,
            productItemQuantityId: selectedPackage,
            productQuantityId: selectedPackageQuantity,
            quantity: quantity,
        };
        if (onAddToCart) {
            onAddToCart(cartItem);
        } else {
            // fallback: log to console
        }
        onClose();
    };

    return (
        <>
            <div className="pt-2 px-0 md:px-3">
                <div className="flex justify-start items-end gap-2 mb-4">
                    {/* Product Images */}
                    <div
                        className="cursor-pointer inline-block relative border border-gray-light rounded-[10px]"
                        onClick={() => setViewerOpen(true)}
                    >
                        <Image
                            src={productDetail.productUrl}
                            alt={productDetail.productName}
                            width={60}
                            height={150}
                            className="md:h-[150px] h-[100px] w-auto object-contain"
                        />
                        <div className='absolute top-0 right-0 p-2 flex items-center justify-center bg-secondary rounded-full'>
                            <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    {viewerOpen && (
                        <ImageViewer
                            media={[productDetail.productUrl]}
                            currentIndex={0}
                            isOpen={viewerOpen}
                            onClose={() => setViewerOpen(false)}
                        />
                    )}


                    {/* Price */}
                    <span className="text-2xl lg:text-3xl font-semibold text-primary">฿{productDetail?.price ?? "0"}</span>
                    {productDetail?.originalPrice && (
                        <span className="text-xs text-disabled line-through">฿{productDetail?.originalPrice}</span>
                    )}
                </div>

                <hr className='w-full my-4 border-gray-light' />

                {
                    productDetail.typeSizeList.length > 0 ?
                        <>
                            {/* Type Selection */}
                            <p className="mb-2 font-semibold">เลือกชนิด</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-6 overflow-y-auto max-h-32">
                                {
                                    productDetail.typeSizeList?.map((typeSize, index) => (
                                        <button
                                            key={index}
                                            onClick={
                                                () => {
                                                    setSelectedType(typeSize.productItemId)
                                                    setSelectedTypeIndex(index)
                                                }
                                            }
                                            className={`flex py-2 px-3 rounded-full border ${selectedType === typeSize.productItemId
                                                ? 'bg-primary-light border-primary text-primary'
                                                : 'border-gray-light text-black'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                {typeSize.file.url &&
                                                    <Image
                                                        src={typeSize.file.url}
                                                        alt={typeSize.productItemName}
                                                        width={30}
                                                        height={30}
                                                        className="w-auto object-contain"
                                                    />
                                                }
                                                <span>{typeSize.productItemName}</span>
                                            </div>
                                        </button>
                                    ))
                                }
                            </div>

                            <hr className='w-full my-4 border-gray-light' />

                            {/* Package Selection */}
                            {
                                productDetail.typeSizeList[selectedTypeIndex].quantityList?.length > 0 &&
                                <div className="mb-6">
                                    <p className="mb-2 font-semibold">เลือกจำนวน</p>

                                    <div className='flex flex-wrap items-center gap-x-2 gap-y-2 mb-6 overflow-y-auto max-h-32'>
                                        {
                                            productDetail.typeSizeList[selectedTypeIndex].quantityList?.map((quantity, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedPackage(quantity.productQuantityId)}
                                                    className={`flex py-2 px-3 rounded-full border ${selectedPackage === quantity.productQuantityId
                                                        ? 'bg-primary-light border-primary text-primary'
                                                        : 'border-gray-light text-black'
                                                        }`}
                                                >
                                                    {quantity.productQuantityName}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                        </>
                        :
                        productDetail.quantityList?.length > 0 &&
                        <div className="mb-6">
                            <p className="text-sm mb-2">เลือกจำนวน</p>

                            <div className='flex flex-wrap items-center gap-x-2 gap-y-2 mb-6 overflow-y-auto max-h-32'>
                                {
                                    productDetail.quantityList?.map((quantity, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedPackageQuantity(quantity.productQuantityId)}
                                            className={`flex py-2 px-3 rounded-full border ${selectedPackageQuantity === quantity.productQuantityId
                                                ? 'bg-primary-light border-primary text-primary'
                                                : 'border-gray-light text-black'
                                                }`}
                                        >
                                            {quantity.productQuantityName}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                }

                {/* Quantity Selection */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex flex-col">
                        <p className="font-semibold mb-2">จำนวน</p>
                        <p className="text-xs text-gray-500 mb-2">สามารถกรอกจำนวนที่ต้องการได้</p>
                    </div>
                    <div className="flex items-center justify-end gap-x-2">
                        <button
                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                            className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-10 h-10 text-center bg-white outline-none border border-gray-light rounded-[10px]"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    variant="default"
                    className="w-full bg-primary hover:bg-primary-hover"
                >
                    เพิ่มไปยังตะกร้า
                </Button>
            </div >
        </>
    )
}

export default ProductSelect; 