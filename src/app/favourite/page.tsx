'use client'

import React from 'react'
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { useFavourites } from '@/lib/react-query/favourite';
import Loading from '@/components/common/Loading';
import { useSession } from 'next-auth/react';

export default function FavouritePage() {

    const { data: session } = useSession();
    const lineUserId = session?.user?.id;

    const {
        data: favouriteList,
        isLoading: favouritesLoading,
        refetch
    } = useFavourites({
        lineUserId: lineUserId ?? "",
        page: 0,
        size: 99,
    });

    if (favouritesLoading) return <Loading fullscreen />

    // Check if there are no favorite items
    if (!favouriteList?.content || favouriteList.content.length === 0) {
        return (
            <section className='md:py-24 py-12'>
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
        <section className='md:py-24 py-12'>
            <div className='lg:container mx-auto space-y-8 py-5 md:px-5 px-3'>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {favouriteList.content.map((favourite) => (
                        <ProductCard key={favourite.id} product={favourite as Product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
