'use client';

import { Heart, Home, Info, X, LogOut, PackageCheck, UserCircle, ChevronLeft } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Loading from "../common/Loading";
import Image from "next/image";
import { useState } from "react";
import Modal from "../common/Modal";
import { useRouter, usePathname } from "next/navigation";
import { AccountModal } from "../form/modal-account";
import { Button } from "../ui/Button";
import { useLineProfile } from "@/lib/react-query/user";



const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {

    const { data: session, status } = useSession()
    const [myAccountModal, setMyAccountModal] = useState(false);

    const { data: lineProfileData } = useLineProfile(session?.user?.id ?? "");

    const { push } = useRouter()
    const pathname = usePathname()

    async function SignIn() {
        await signIn("line", { callbackUrl: pathname });
    }

    if (status === "loading") {
        return <Loading />;
    }

    async function myAccount() {
        // if (!session) signIn("line");
        setMyAccountModal(true)
    }

    const menuItems = [
        {
            icon: <Home className="h-6 w-6 mr-4" />,
            label: 'หน้าหลัก',
            onClick: () => {
                onClose();
                push('/');
            }
        },
        {
            icon: <UserCircle className="h-6 w-6 mr-4" />,
            label: 'บัญชีของฉัน',
            onClick: () => {
                onClose();
                if (session) myAccount()
                else push(`/auth/auto-signin?callbackUrl=${encodeURIComponent(pathname)}`)
            }
        },
        {
            icon: <Heart className="h-6 w-6 mr-4" />,
            label: 'รายการที่ถูกใจ',
            onClick: () => {
                onClose();
                push('/favourite');
            }
        },
        {
            icon: <PackageCheck className="h-6 w-6 mr-4" />,
            label: 'รายการสินค้าที่เคยส่งให้แอดมิน',
            onClick: () => {
                onClose();
                push('/history');
            }
        },
        {
            icon: <Info className="h-6 w-6 mr-4" />,
            label: 'วิธีสั่งสินค้า',
            onClick: () => {
                onClose();
                push('/how-to-order');
            }
        },
        {
            icon:
                <div className="relative h-6 w-6 mr-4">
                    <Image src={'/images/contact-nhamaew.png'} alt={"contact-nhamaew"} layout="fill" objectFit="cover" />
                </div>,
            label: 'ช่องทางติดต่อหน้าแมว',
            onClick: () => {
                onClose();
                window.open("https://instabio.cc/nhamaew", "_blank", "noopener,noreferrer");
            }
        },
    ]

    return (
        <div className={`fixed inset-0 bg-black/60 z-[41] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div
                className={`
                    fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col
                    w-full max-w-[100vw] md:w-xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end items-center p-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 flex items-center">
                        <X className="h-6 w-6 hidden lg:block" />
                        <ChevronLeft className="h-6 w-6 lg:hidden" />
                        <span className="ml-1 hidden lg:block">ปิด</span>
                        <span className="ml-1 lg:hidden">ย้อนกลับ</span>
                    </button>
                </div>

                <div className="md:px-20 px-4">
                    <div className="bg-primary-light rounded-[20px] p-4">
                        {!session ?
                            <Button size="md" className="w-full" onClick={SignIn}>
                                เข้าสู่ระบบ/สมัครสมาชิก
                            </Button>
                            :
                            <div className="flex gap-3">
                                <Image src={session?.user?.image ?? ''} className="rounded-[10px]" width={50} height={50} alt="img-profile" />
                                <div className="flex flex-col items-start justify-center">
                                    <h3 className="font-semibold text-xl">
                                        {session?.user?.name}
                                    </h3>
                                </div>
                            </div>
                        }

                    </div>
                </div>

                <nav className="flex-grow md:px-20 px-4 space-y-2 mt-5">
                    {menuItems.map(item => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={item.onClick}
                            className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 w-full text-left"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <hr className="border-gray-light px-3" />
                    {
                        session &&
                        <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="flex w-full items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100">
                            <LogOut className="h-6 w-6 mr-4" />
                            <span>ออกจากระบบ</span>
                        </button>
                    }
                </nav>
            </div>

            <Modal
                header="บัญชีของฉัน"
                open={myAccountModal}
                onClose={() => setMyAccountModal(false)}
            >
                <AccountModal
                    open={myAccountModal}
                    onClose={() => setMyAccountModal(false)}
                    profileData={lineProfileData}
                />
            </Modal>
        </div>


    );
};

export default Sidebar; 