'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, Menu, Search, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMyCartCount } from "@/lib/react-query/cart";
import { useSession } from "next-auth/react";
import { filters } from "@/constants";
import { useScrollHeader } from "@/hooks/useScrollHeader";

const Header = ({ onMenuClick, className, title }: { onMenuClick: () => void; className?: string; title?: string }) => {

    const { data: session } = useSession();

    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchTextLabel, setSearchTextLabel] = useState("");

    const { data: cartItemCount } = useMyCartCount({ lineUserId: session?.user?.id ?? "" });

    const { push, back } = useRouter();

    // Scroll-based header visibility for mobile
    const { isVisible, isScrolled } = useScrollHeader({
        enabled: true, // Enable scroll behavior
        threshold: 10 // Minimum scroll distance to trigger hide/show
    });

    // Get active filter from URL params
    const activeFilter = searchParams.get('filter') || 'BSP';

    function onSearch() {
        setShowSearch(false)
        push(`/search?searchtext=${searchText}`)
        setSearchTextLabel(searchText)
    }

    // Handle filter change
    function onFilterChange(filterValue: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('filter', filterValue);
        push(`${pathname}?${params.toString()}`);
    }

    useEffect(() => {
        const searchTextParam = searchParams.get('searchtext');

        if (pathname.includes("/search") && searchTextParam) {
            setSearchTextLabel(searchTextParam)
            setSearchText(searchTextParam)
        } else {
            setSearchTextLabel("")
            setSearchText("")
        }
    }, [pathname, showSearch, searchParams])

    return (
        <>
            {/* Search Overlay Modal */}
            {showSearch && (
                <div className="fixed inset-0 z-[1000] bg-black/60 flex flex-col" style={{ backdropFilter: 'blur(2px)' }}>
                    <div className="bg-white w-full py-6 px-3 shadow-lg relative">
                        <div className="lg:container mx-auto px-3">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold text-lg">ค้นหาสินค้า</span>
                                <button onClick={() => setShowSearch(false)} className="text-gray-500 flex items-center gap-1 lg:text-xl text-sm">
                                    <X className="h-6 w-6 hidden lg:block" />
                                    <ChevronLeft className="h-6 w-6 lg:hidden" />
                                    <p className="hidden lg:block">ปิด</p>
                                    <p className="lg:hidden">ย้อนกลับ</p>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        onSearch();
                                    }}
                                    className="flex items-center gap-2 w-full"
                                >
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="ค้นหาสินค้า"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            className="w-full placeholder:text-subdube text-black pl-10 pr-10 px-4 py-2 border border-gray-light rounded-lg focus:outline-none text-base"
                                            autoFocus
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Search className="h-5 w-5 text-subdube" />
                                        </div>
                                        {searchText && (
                                            <button
                                                onClick={() => setSearchText('')}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-subdube hover:text-gray-700 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                    <Button size="md" type="submit">
                                        ค้นหา
                                    </Button>
                                </form>
                            </div>
                        </div>
                        <div className="flex-1" onClick={() => setShowSearch(false)} />
                    </div>
                </div>
            )}

            <header className="bg-white fixed top-0 left-0 right-0 z-30 w-full">
                <div className="lg:container mx-auto">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex justify-between items-center py-3 px-4">
                        <div className="flex items-center gap-x-4">
                            <Image
                                src={'/images/nhamaew-icon.png'}
                                width={60}
                                height={60}
                                alt="nhamaew-icon"
                                className="w-10 h-10 md:w-[60px] md:h-[60px] cursor-pointer"
                                onClick={() => push('/')}
                            />
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-xl font-semibold text-primary">nhamaew pet store</h1>
                                    <p className="text-xs text-subdube">สินค้าสัตว์เลี้ยงโดยทีมสัตวแพทย์</p>
                                </div>
                                <button onClick={onMenuClick} className="cursor-pointer border-l border-gray-light flex items-center space-x-2 text-primary px-3 py-2 text-sm">
                                    <Menu className="h-5 w-5" />
                                    <span>เมนู</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Button size="md" leftIcon={<ShoppingCart className="h-5 w-5" />} onClick={() => push('/my-cart')}>
                                    ตะกร้า
                                </Button>
                                {
                                    (cartItemCount && cartItemCount?.total > 0) &&
                                    <div className="absolute -top-2 -right-2 bg-critical text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount.total > 99 ? '99+' : cartItemCount.total}
                                    </div>
                                }
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ค้นหาสินค้า"
                                    value={searchTextLabel}
                                    className="w-64 placeholder:text-subdube text-subdube pl-10 px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-pointer bg-white"
                                    readOnly
                                    onClick={() => setShowSearch(true)}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-5 w-5 text-subdube" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile & Tablet Header */}
                    {
                        !pathname.startsWith("/my-cart") &&
                        <div className={`lg:hidden grid grid-cols-3 items-center py-4 px-4 ${className ? className : ''}`}>
                            <button onClick={onMenuClick} className={`cursor-pointer flex items-center space-x-2 text-primary pr-3 py-2 text-sm`}>
                                <Menu className="h-5 w-5" />
                                <span>เมนู</span>
                            </button>
                            <div className="flex flex-col items-center justify-center">
                                <Image
                                    src={'/images/nhamaew-icon.png'}
                                    width={40}
                                    height={40}
                                    alt="nhamaew-icon"
                                    className="w-12 h-12 md:w-[60px] md:h-[60px]"
                                    onClick={() => push('/')}
                                />
                                <div className="hidden sm:flex flex-col items-center">
                                    <h1 className="text-xs font-semibold text-primary text-center">nhamaew pet store</h1>
                                    <p className="text-[10px] text-subdube text-center">สินค้าสัตว์เลี้ยงโดยทีมสัตวแพทย์</p>
                                </div>
                            </div>
                            <div className="relative justify-self-end">
                                <Button size="sm" className="w-fit justify-self-end" leftIcon={<ShoppingCart className="h-5 w-5" />} onClick={() => push('/my-cart')}>
                                    ตะกร้า
                                </Button>
                                {
                                    (cartItemCount && cartItemCount?.total > 0) &&
                                    <div className="absolute -top-2 -right-2 bg-critical text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount.total > 99 ? '99+' : cartItemCount.total}
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    {(!pathname.startsWith("/product") && !pathname.startsWith("/my-cart") && !pathname.startsWith("/favourite") && !pathname.startsWith("/history") && !pathname.startsWith("/how-to-order")) &&
                        <div className="lg:hidden px-4 pb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ค้นหาสินค้า"
                                    value={searchTextLabel}
                                    className="w-full placeholder:text-subdube text-subdube pl-10 px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-pointer bg-white"
                                    readOnly
                                    onClick={() => setShowSearch(true)}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-5 w-5 text-subdube" />
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {
                    (pathname !== "/") &&
                    <div className="flex bg-secondary justify-start items-center">
                        <div className="lg:container mx-auto space-y-8 py-3 w-full">
                            <div className="px-4">
                                <button type="button" className="cursor-pointer flex juss items-center gap-x-2 text-white hover:text-primary-hover" onClick={() => back()}>
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>ย้อนกลับ</span>
                                </button>
                            </div>
                        </div>
                    </div>
                }
                {
                    title &&
                    <div className="bg-white">
                        <div className="lg:container mx-auto w-full bg-white px-5 py-3">
                            <h3 className="text-2xl text-black font-semibold">{title}</h3>
                        </div>
                    </div>
                }

                {/* Filter buttons for search page */}
                {pathname.startsWith("/search") && (
                    <div className={`bg-white transition-transform duration-300 ease-in-out ${isVisible ? 'flex' : 'hidden'} md:flex`}>
                        <div className={` space-x-2 mb-6 overflow-x-auto pb-2 bg-white lg:container mx-auto px-4 py-2 ${isVisible ? 'flex' : 'hidden'} md:flex`}>
                            {filters.map((filter, index) => (
                                <button
                                    key={index}
                                    className={
                                        "cursor-pointer px-4 py-2 rounded-full whitespace-nowrap border " +
                                        (activeFilter === filter.value
                                            ? "bg-primary-light text-primary border-primary"
                                            : "bg-white border-gray-300 hover:bg-gray-200")
                                    }
                                    onClick={() => onFilterChange(filter.value)}
                                    type="button"
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header >
        </>
    )
}

export default Header; 