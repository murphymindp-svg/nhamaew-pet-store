import React from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface CartFooterProps {
    totalSavings: number;
    onSendToAdmin: () => void;
    totalItems: number;
    totalAmount: number;
    isLoading?: boolean;
}

const CartFooter: React.FC<CartFooterProps> = ({
    totalSavings,
    onSendToAdmin,
    totalItems,
    totalAmount,
    isLoading = false
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 ">
            <div className='bg-secondary text-white '>
                <div className="lg:container mx-auto py-2">
                    <div className="flex items-center justify-center">
                        {/* Left side - Savings info */}
                        <div className="flex items-center gap-2">
                            <Image src="/icons/cart-heart.svg" alt="heart" className="w-4 h-4" width={18} height={18} />
                            <span className="text-base font-semibold">
                                ประหยัดไป ฿{totalSavings.toLocaleString()} น้องได้สินค้าดี คุณได้ราคาดี
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-white'>
                <div className="lg:container mx-auto px-4 ">
                    <div className="grid grid-cols-2 gap-x-2 py-4 md:flex md:items-center md:justify-end">
                        <div className='flex flex-col items-end gap-x-2'>
                            <div className='flex items-center gap-x-2'>
                                <span className="text-base text-black">
                                    ยอดรวมสินค้า
                                </span>
                                <span className="text-xl text-primary font-semibold">
                                    ฿{totalAmount.toLocaleString()}
                                </span>
                            </div>
                            <p className='text-subdube text-sm'>
                                ไม่รวมค่าจัดส่ง
                            </p>
                        </div>
                        <Button
                            onClick={onSendToAdmin}
                            variant={'default'}
                            disabled={isLoading}
                        >
                            {isLoading ? 'กำลังส่ง...' : 'ส่งรายการสินค้าให้แอดมิน'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartFooter; 