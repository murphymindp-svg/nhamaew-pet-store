import React from 'react';
import Image from 'next/image';

export default function HowToOrderPage() {
    return (
        <section className='md:py-24 py-12 max-w-5xl mx-auto'>
            <div className='lg:container mx-auto space-y-8 py-5 md:px-5 px-3 max-w-4xlmd:py-8'>
                <div className="relative w-full">
                    <Image
                        src="/images/how-to-buy.jpg"
                        alt="วิธีการสั่งซื้อสินค้าออนไลน์ - How to Shop Online Step by Step Guide"
                        width={1083}
                        height={855}
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
