"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/common/Loading";

export default function AutoSignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get the callback URL from search params, default to home page
        const callbackUrl = searchParams.get('callbackUrl') || '/';

        // Automatically trigger LINE sign-in when page loads
        signIn("line", {
            callbackUrl: callbackUrl // Redirect to intended page after successful sign-in
        });
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <Loading className="mx-auto h-12 w-12" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        กำลังเข้าสู่ระบบ
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        กรุณารอสักครู่...
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 text-blue-600 hover:text-blue-500 text-sm underline"
                    >
                        กลับหน้าหลัก
                    </button>
                </div>
            </div>
        </div>
    );
} 