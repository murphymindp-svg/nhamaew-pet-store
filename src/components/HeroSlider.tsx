'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Banner } from '@/types/banner';


const HeroSlider = ({ banners }: { banners: Banner[] }) => {

    return (
        <section className="relative rounded-lg overflow-hidden">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="hero-swiper h-full md:h-auto"
            >
                {banners.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                            <img src={slide.imageUrl} alt={slide.name} className='w-full h-full object-cover' />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

export default HeroSlider; 