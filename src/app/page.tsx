'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';

import { CATEGORIES, filters } from '@/constants';
import { SearchCategoryModal } from '@/components/form/modal-search-category';
import { useBannersAndCategory } from '@/lib/react-query/banner';
import Loading from '@/components/common/Loading';
import { useInfiniteProducts } from '@/lib/react-query/product';
import { Product } from '@/types/product';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {

  const [activeFilter, setActiveFilter] = useState("BSP");
  const [categorySearchModal, setCategorySearchModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({
    animalType: "",
    name: ""
  });
  const { data, isLoading, refetch } = useBannersAndCategory();
  const {
    data: productList,
    isLoading: productsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteProducts({
    keyword: "",
    size: 8,
    sortDirection: activeFilter
  });

  // Get all products from infinite query pages
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


  async function SearchCategory(name: string, animalType: string) {
    setCategoryFilter({
      animalType: animalType,
      name: name
    })

    setCategorySearchModal(true)
  }

  if (isLoading) return <Loading fullscreen />

  return (
    <section>
      <div className='bg-white'>
        <div className='lg:container mx-auto space-y-4 md:space-y-8 py-3 md:px-5 px-3'>
          <HeroSlider banners={data?.bannerList ?? []} />

          {/* Categories Section */}
          <section>
            <h3 className="text-2xl font-semibold mb-4">หมวดหมู่สินค้า</h3>
            <div className="relative">
              <Swiper
                spaceBetween={16}
                slidesPerView={CATEGORIES.length === 1 ? 1 : 1.5}
                breakpoints={{
                  768: {
                    slidesPerView: CATEGORIES.length === 1 ? 1 : 2,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: CATEGORIES.length === 1 ? 1 : 2,
                    spaceBetween: 24,
                  }
                }}
                modules={[Navigation, Pagination]}
                className="categories-swiper"
              >
                {data?.animalCategoryList?.map((category, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative rounded-lg overflow-hidden lg:h-[377px] md:h-[172px] h-[118px]"
                      onClick={() => SearchCategory(category.name, category.animalType)}
                    >
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        layout="fill"
                        objectFit="cover"
                        className='cursor-pointer'

                      />
                      {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
                      {/* Desktop & Tablet Button - Hidden on Mobile */}
                      <div className="absolute inset-0  items-end p-4 lg:flex hidden">
                        <button className="bg-white text-black font-semibold py-2 px-4 rounded-full"
                          onClick={() => SearchCategory(category.name, category.animalType)}
                        >
                          ดูสินค้า{category.name}
                        </button>
                      </div>
                    </div>
                    {/* Mobile- Hidden on Desktop & Tablet Button */}
                    <div className="bg-opacity-30 items-end pt-4 pb-2 lg:hidden flex">
                      <button
                        type='button'
                        className=" text-black font-semibold py-2 pr-4 rounded-full flex gap-x-2 items-center"
                        onClick={() => SearchCategory(category.name, category.animalType)}
                      >
                        ดูสินค้า{category.name} <ChevronRight className='w-4 h-4' />
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>

          <hr className='border-gray-light w-full' />


          <h3 className="text-2xl font-semibold mb-4">รายการสินค้าทั้งหมด</h3>
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={
                  "cursor-pointer px-4 py-2 rounded-full whitespace-nowrap border " +
                  (activeFilter === filter.value
                    ? "bg-primary-light text-primary border-primary"
                    : "bg-white border-gray-300 hover:bg-gray-200")
                }
                onClick={() => setActiveFilter(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='bg-gray-light'>
        <div className='lg:container mx-auto space-y-8 py-5 md:px-5 px-3 '>
          <section>
            {/* Section Product List */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {
                productsLoading ? <Loading className='w-full col-span-4' /> :
                  allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>

            {/* Intersection Observer Target */}
            <div ref={loadMoreRef} className="h-10 w-full" />

            {/* Load More Indicator */}
            {isFetchingNextPage && (
              <div className="flex justify-center mt-6 w-full">
                <Loading className='w-full' />
              </div>
            )}
          </section>
        </div>
      </div>


      <SearchCategoryModal
        open={categorySearchModal}
        animalType={categoryFilter.animalType}
        name={categoryFilter.name}
        onClose={() => setCategorySearchModal(false)}
      />
    </section>
  );
}
