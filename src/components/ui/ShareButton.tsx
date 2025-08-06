"use client";

import React from 'react';
import { useLiffShare } from '@/hooks/useLiff';
import { ShareMessage } from '@/types/liff';
import { Button } from './Button';

interface ShareButtonProps {
    messages: ShareMessage[];
    children?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export function ShareButton({
    messages,
    children = 'แชร์',
    className,
    variant = 'default',
    size = 'md',
    disabled,
    onSuccess,
    onError
}: ShareButtonProps) {
    const { shareTargetPicker, canShare } = useLiffShare();

    const handleShare = async () => {
        try {
            const success = await shareTargetPicker(messages);
            if (success) {
                onSuccess?.();
            }
        } catch (error) {
            console.error('Share failed:', error);
            onError?.(error);
        }
    };

    // Don't render if sharing is not available
    if (!canShare) {
        return null;
    }

    return (
        <Button
            onClick={handleShare}
            variant={variant}
            size={size}
            disabled={disabled}
            className={className}
        >
            {children}
        </Button>
    );
}

// Specific share buttons for common use cases
interface ProductShareButtonProps {
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        description?: string;
    };
    className?: string;
    children?: React.ReactNode;
}

export function ProductShareButton({
    product,
    className,
    children = '📤 แชร์สินค้า'
}: ProductShareButtonProps) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const productUrl = `${baseUrl}/product/${product.id}`;

    const flexMessage: ShareMessage = {
        type: 'flex',
        altText: `สินค้า: ${product.name}`,
        contents: {
            type: 'bubble',
            hero: {
                type: 'image',
                url: product.imageUrl,
                size: 'full',
                aspectRatio: '20:13',
                aspectMode: 'cover'
            },
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: product.name,
                        weight: 'bold',
                        size: 'xl',
                        wrap: true
                    },
                    {
                        type: 'text',
                        text: `฿${product.price.toLocaleString()}`,
                        weight: 'bold',
                        size: 'lg',
                        color: '#E91E63'
                    },
                    ...(product.description ? [{
                        type: 'text',
                        text: product.description,
                        size: 'sm',
                        color: '#666666',
                        wrap: true
                    }] : [])
                ]
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                    {
                        type: 'button',
                        style: 'primary',
                        height: 'sm',
                        action: {
                            type: 'uri',
                            label: 'ดูสินค้า',
                            uri: productUrl
                        }
                    }
                ]
            }
        }
    };

    return (
        <ShareButton
            messages={[flexMessage]}
            className={className}
            variant="outline"
        >
            {children}
        </ShareButton>
    );
}

interface TextShareButtonProps {
    text: string;
    className?: string;
    children?: React.ReactNode;
}

export function TextShareButton({
    text,
    className,
    children = 'แชร์ข้อความ'
}: TextShareButtonProps) {
    const textMessage: ShareMessage = {
        type: 'text',
        text
    };

    return (
        <ShareButton
            messages={[textMessage]}
            className={className}
            variant="outline"
        >
            {children}
        </ShareButton>
    );
}

export default ShareButton; 