"use client";
import Loading from "@/components/common/Loading";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import { useLoadingStore } from "@/providers/loading-store-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { JSX, Suspense, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MainLayout from "./main";
import ProductLayout from "./product";
import 'react-toastify/dist/ReactToastify.css';
import MainGreyLayout from "./main-grey";

export type LayoutsProps = {
    children: JSX.Element | React.ReactNode;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export default function Layouts({ children }: LayoutsProps) {

    const pathname = usePathname();
    const isLoading = useLoadingStore((state) => state.isLoading);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [title, setTitle] = useState('');

    const setLoadingPortal = (): JSX.Element =>
        isLoading ? (
            createPortal(
                <Loading fullscreen />,
                document.getElementById("portal")!
            )
        ) : (
            <></>
        );

    // Handle page title based on pathname
    useEffect(() => {
        if (pathname.startsWith("/search")) {
            setTitle("รายการค้นหา");
        } else if (pathname.startsWith("/favourite")) {
            setTitle("รายการที่ถูกใจ");
        } else if (pathname.startsWith("/history")) {
            setTitle("รายการสินค้าที่เคยส่งให้แอดมิน");
        } else if (pathname.startsWith("/how-to-order")) {
            setTitle("วิธีการสั่งซื้อ");
        } else if (pathname.startsWith("/my-cart")) {
            setTitle("สินค้าในตะกร้าของฉัน");
        } else {
            setTitle(""); // Clear title for other pages
        }
    }, [pathname]);

    // Disable body overflow when sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to restore overflow when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    if (pathname.startsWith("/error")) {
        return children;
    }

    if (pathname.startsWith("/auth/auto-signin")) {
        return children;
    }


    if (pathname.startsWith("/product")) {
        return (
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<Loading fullscreen />}>
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
                    <ProductLayout>
                        {children}
                        {setLoadingPortal()}
                    </ProductLayout>
                </Suspense>
            </QueryClientProvider>
        )
    }

    if (pathname.startsWith("/favourite") || pathname.startsWith("/history") || pathname.startsWith("/my-cart") || pathname.startsWith("/search")) {
        return (
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<Loading fullscreen />}>
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
                    <MainGreyLayout>
                        {children}
                        {setLoadingPortal()}
                    </MainGreyLayout>
                </Suspense>
            </QueryClientProvider>
        )
    }


    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<Loading fullscreen />}>
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
                <MainLayout>
                    {children}
                    {setLoadingPortal()}
                </MainLayout>
            </Suspense>
        </QueryClientProvider>
    )
}
