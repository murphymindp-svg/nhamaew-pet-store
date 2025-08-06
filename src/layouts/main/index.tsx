"use client";
import { swal } from "@/components/common/SweetAlert";
import { Button } from "@/components/ui/Button";
import useLiff from "@/hooks/useLiff";
import { useChatWithAdmin } from "@/lib/react-query/chat";
import { useProductDetail } from "@/lib/react-query/product";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react";

export type LayoutsProps = {
    children: JSX.Element | React.ReactNode;
};

export default function MainLayout({ children }: LayoutsProps) {

    const pathname = usePathname();
    const { data: session } = useSession();

    const { mutate: initiateChatWithAdmin, isPending: chatLoading } = useChatWithAdmin();
    const { push } = useRouter();
    const { closeWindow } = useLiff();


    const handleChatWithAdmin = () => {

        if (!session?.user?.id) {
            // Redirect to login if not authenticated
            push(`/auth/auto-signin?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        swal.fire({
            icon: "warning",
            title: "หน้านี้จะถูกปิดลงและพาคุณกลับไปที่ไลน์เพื่อแชทกับแอดมิน",
            confirmButtonText: "ตกลง",
            showDenyButton: true,
            denyButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                initiateChatWithAdmin({
                    lineUserId: session.user.id
                }, {
                    onSuccess: (response) => {
                        closeWindow();
                    },
                    onError: (error) => {
                        swal.fire({
                            icon: "error",
                            title: "เกิดข้อผิดพลาด",
                            text: "ไม่สามารถเชื่อมต่อแชทได้ กรุณาลองใหม่อีกครั้ง",
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="min-h-screen font-sans py-32 md:py-28">
            {children}
            {
                pathname == "/" &&
                <Button size="md"
                    className="z-40 fixed bottom-6 right-6 transition-colors"
                    leftIcon={<MessageCircle className='w-5 h-5' />}
                    onClick={handleChatWithAdmin}
                >
                    <span className="inline">แชทกับแอดมิน</span>
                </Button>
            }
        </div>
    );
}
