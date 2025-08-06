"use client";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { JSX } from "react";

export type LayoutsProps = {
    children: JSX.Element | React.ReactNode;
};

export default function MainGreyLayout({ children }: LayoutsProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen font-sans py-32 md:py-28 bg-gray-light">
            {children}
            {/* {
                !pathname.startsWith("/my-cart") &&
                <Button size="md" className="z-40 fixed bottom-6 right-6 transition-colors" leftIcon={<MessageCircle className='w-5 h-5' />}>
                    <span className="inline">แชทกับแอดมิน</span>
                </Button>
            } */}
        </div>
    );
}
