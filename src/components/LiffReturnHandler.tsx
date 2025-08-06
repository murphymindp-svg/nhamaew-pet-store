"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiff } from '@/hooks/useLiff';

interface LiffReturnHandlerProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    redirectTo?: string;
    children?: React.ReactNode;
}

export function LiffReturnHandler({
    onSuccess,
    onError,
    redirectTo = '/',
    children
}: LiffReturnHandlerProps) {
    const router = useRouter();
    const { isInitialized, isLoggedIn, isLoading, error } = useLiff();
    const [hasProcessed, setHasProcessed] = useState(false);

    useEffect(() => {
        if (!isInitialized || isLoading || hasProcessed) return;

        const processReturn = async () => {
            try {
                setHasProcessed(true);

                // Check if there's an error parameter in URL
                const urlParams = new URLSearchParams(window.location.search);
                const errorParam = urlParams.get('error');
                const errorDescription = urlParams.get('error_description');

                if (errorParam) {
                    const errorMessage = errorDescription || `LIFF Error: ${errorParam}`;
                    console.error('LIFF Return Error:', errorMessage);
                    onError?.(errorMessage);
                    return;
                }

                // Check login status
                if (isLoggedIn) {
                    console.log('LIFF Return: User is logged in');
                    onSuccess?.();

                    // Redirect if specified
                    if (redirectTo !== window.location.pathname) {
                        router.push(redirectTo);
                    }
                } else {
                    console.log('LIFF Return: User is not logged in');
                    // You might want to trigger login here or handle the case
                    onError?.('User is not logged in');
                }

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.error('LIFF Return Processing Error:', errorMessage);
                onError?.(errorMessage);
            }
        };

        processReturn();
    }, [isInitialized, isLoggedIn, isLoading, hasProcessed, onSuccess, onError, redirectTo, router]);

    useEffect(() => {
        if (error && !hasProcessed) {
            onError?.(error);
            setHasProcessed(true);
        }
    }, [error, hasProcessed, onError]);

    // Show loading state while processing
    if (isLoading || !hasProcessed) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังประมวลผล...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        ลองใหม่
                    </button>
                </div>
            </div>
        );
    }

    // Render children if provided, otherwise nothing
    return children ? <>{children}</> : null;
}

// Hook for handling LIFF return scenarios
export function useLiffReturn() {
    const [isProcessing, setIsProcessing] = useState(true);
    const [returnError, setReturnError] = useState<string | null>(null);
    const { isInitialized, isLoggedIn, error } = useLiff();

    useEffect(() => {
        if (!isInitialized) return;

        const processReturn = () => {
            try {
                // Check URL parameters for errors
                const urlParams = new URLSearchParams(window.location.search);
                const errorParam = urlParams.get('error');
                const errorDescription = urlParams.get('error_description');

                if (errorParam) {
                    const errorMessage = errorDescription || `LIFF Error: ${errorParam}`;
                    setReturnError(errorMessage);
                } else if (error) {
                    setReturnError(error);
                }

                setIsProcessing(false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Processing error';
                setReturnError(errorMessage);
                setIsProcessing(false);
            }
        };

        processReturn();
    }, [isInitialized, error]);

    return {
        isProcessing,
        isLoggedIn,
        error: returnError,
        isReady: isInitialized && !isProcessing
    };
}

// Higher-order component for pages that need LIFF return handling
export function withLiffReturn<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function LiffReturnWrapper(props: P) {
        const { isProcessing, isLoggedIn, error, isReady } = useLiffReturn();

        if (isProcessing) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">กำลังโหลด...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center max-w-md mx-auto p-6">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            ลองใหม่
                        </button>
                    </div>
                </div>
            );
        }

        if (!isReady) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}

export default LiffReturnHandler; 