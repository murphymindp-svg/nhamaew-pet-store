'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useOrderHistory } from '@/lib/react-query/cart';
import { useSession } from 'next-auth/react';
import Loading from '@/components/common/Loading';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    productItemName: string;
    productItemQuantityName: string;
    productQuantityName: string;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: string;
    items: OrderItem[];
    total: number;
}

const OrderAccordion: React.FC<{ order: Order }> = ({ order }) => {
    const [showAllItems, setShowAllItems] = useState(false);

    const displayItems = showAllItems ? order.items : order.items.slice(0, 1);

    return (
        <div className="bg-white rounded-lg mb-4 overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-black">
                            เลขที่สั่งซื้อ : <span className="text-primary font-semibold">{order.orderNumber}</span>
                        </p>
                        <p className="text-sm text-subdube mt-1">
                            วันที่ทำรายการ {order.date}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 pt-2 flex flex-col gap-y-2">
                {/* Display Items */}
                {displayItems.map((item) => (
                    <div key={item.id} className='mb-4'>
                        <div className="flex items-center gap-1">
                            <div className="mr-3 w-20 h-20 flex-shrink-0 border border-gray-light rounded-[14px]">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="object-contain w-full h-full rounded-[14px]"
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-sm font-semibold text-black line-clamp-2 mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-subdube">
                                    {item.productItemName} {item.productItemQuantityName} {item.productQuantityName}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-black">
                                ฿{item.price.toLocaleString()} <span className="text-xs text-subdube">x{item.quantity}</span>
                            </p>
                        </div>
                    </div>
                ))}

                {/* Show More Button */}
                {order.items.length > 1 && (
                    <button
                        onClick={() => setShowAllItems(!showAllItems)}
                        className="flex items-center justify-center w-full py-2 text-sm text-black hover:text-gray-800 transition-colors"
                    >
                        <span className="mr-2">
                            {showAllItems ? 'ดูน้อยลง' : `ดูเพิ่มเติม`}
                        </span>
                        {showAllItems ? (
                            <ChevronUp className="w-4 h-4 text-primary" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-primary" />
                        )}
                    </button>
                )}

                {/* Order Total */}
                <div className="pt-2">
                    <div className="flex justify-end items-center gap-x-2">
                        <span className="text-sm text-black">
                            สินค้าทั้งหมด {order.items.length} รายการ :
                        </span>
                        <span className="text-base text-black font-semibold">
                            ฿{order.total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function HistoryPage() {
    const { data: session } = useSession();
    const {
        data: orderHistoryData,
        isLoading,
        isError,
        error
    } = useOrderHistory({
        lineUserId: session?.user?.id || ""
    });

    // Transform API data to component format
    const transformOrderData = (): Order[] => {
        if (!orderHistoryData || orderHistoryData.length === 0) return [];

        return orderHistoryData.map((apiOrder) => ({
            id: apiOrder.id,
            orderNumber: apiOrder.orderCode,
            date: new Date(apiOrder.transactionDate).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: '2-digit'
            }),
            status: apiOrder.status,
            items: apiOrder.orderItemList.map((item) => ({
                id: item.id.toString(),
                name: item.productName,
                price: item.price,
                image: item.imageUrl,
                quantity: item.quantity,
                productItemName: item.productItemName ?? "",
                productItemQuantityName: item.productItemQuantityName ?? "",
                productQuantityName: item.productQuantityName ?? ""
            })),
            total: apiOrder.orderItemList.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }));
    };

    const orders = transformOrderData();

    if (isLoading) {
        return (
            <section className='md:pt-24 pt-12'>
                <div className='lg:container mx-auto space-y-8 py-5 md:px-5 px-3'>
                    <Loading className='w-full' />
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className='md:pt-24 pt-12'>
                <div className='lg:container mx-auto space-y-8 py-5 md:px-5 px-3'>
                    <div className="flex flex-col items-center py-20">
                        <img
                            src="/images/204-no-data.png"
                            alt="Error loading orders"
                            className="w-48 h-48 object-contain"
                        />
                        <p className="mt-4 text-subdube text-base">
                            เกิดข้อผิดพลาดในการโหลดข้อมูล: {error?.message}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <section className='md:pt-24 pt-12'>
                <div className='lg:container mx-auto space-y-8 py-5 md:px-5 px-3'>
                    <div className="flex flex-col items-center py-20">
                        <img
                            src="/images/204-no-data.png"
                            alt="No favorite items"
                            className="w-48 h-48 object-contain"
                        />
                        <p className="mt-4 text-subdube text-base">ยังไม่มีรายการ</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className='md:pt-24 pt-12'>
            <div className='lg:container mx-auto space-y-8 py-5 md:px-5 px-3'>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderAccordion key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </section>
    );
}
