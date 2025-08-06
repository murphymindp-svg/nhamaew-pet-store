import { ShareMessage } from '@/types/liff';
import LiffUtils from './liff';

// Common sharing templates and utilities
export class LiffShareUtils {

    // Share product information
    static async shareProduct(product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        description?: string;
    }) {
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

        return await this.shareTargetPicker([flexMessage]);
    }

    // Share cart information
    static async shareCart(cart: {
        items: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
        total: number;
    }) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const cartUrl = `${baseUrl}/my-cart`;

        const itemsText = cart.items
            .map(item => `• ${item.name} x${item.quantity} = ฿${(item.price * item.quantity).toLocaleString()}`)
            .join('\n');

        const flexMessage: ShareMessage = {
            type: 'flex',
            altText: `ตะกร้าสินค้า - รวม ฿${cart.total.toLocaleString()}`,
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: '🛒 ตะกร้าสินค้า',
                            weight: 'bold',
                            size: 'xl'
                        },
                        {
                            type: 'separator',
                            margin: 'md'
                        },
                        {
                            type: 'text',
                            text: itemsText,
                            size: 'sm',
                            wrap: true,
                            margin: 'md'
                        },
                        {
                            type: 'separator',
                            margin: 'md'
                        },
                        {
                            type: 'text',
                            text: `รวมทั้งหมด: ฿${cart.total.toLocaleString()}`,
                            weight: 'bold',
                            size: 'lg',
                            color: '#E91E63',
                            margin: 'md'
                        }
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
                                label: 'ดูตะกร้า',
                                uri: cartUrl
                            }
                        }
                    ]
                }
            }
        };

        return await this.shareTargetPicker([flexMessage]);
    }

    // Share store location
    static async shareLocation(location: {
        name: string;
        address: string;
        latitude: number;
        longitude: number;
    }) {
        const locationMessage: ShareMessage = {
            type: 'location',
            title: location.name,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude
        };

        return await this.shareTargetPicker([locationMessage]);
    }

    // Share promotion/offer
    static async sharePromotion(promotion: {
        title: string;
        description: string;
        imageUrl?: string;
        code?: string;
        validUntil?: string;
    }) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

        const flexMessage: ShareMessage = {
            type: 'flex',
            altText: `โปรโมชั่น: ${promotion.title}`,
            contents: {
                type: 'bubble',
                ...(promotion.imageUrl && {
                    hero: {
                        type: 'image',
                        url: promotion.imageUrl,
                        size: 'full',
                        aspectRatio: '20:13',
                        aspectMode: 'cover'
                    }
                }),
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: '🎉 ' + promotion.title,
                            weight: 'bold',
                            size: 'xl',
                            wrap: true
                        },
                        {
                            type: 'text',
                            text: promotion.description,
                            size: 'sm',
                            color: '#666666',
                            wrap: true,
                            margin: 'md'
                        },
                        ...(promotion.code ? [{
                            type: 'box',
                            layout: 'vertical',
                            margin: 'lg',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'box',
                                    layout: 'baseline',
                                    spacing: 'sm',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: 'รหัส:',
                                            color: '#aaaaaa',
                                            size: 'sm',
                                            flex: 1
                                        },
                                        {
                                            type: 'text',
                                            text: promotion.code,
                                            wrap: true,
                                            color: '#E91E63',
                                            size: 'sm',
                                            flex: 3,
                                            weight: 'bold'
                                        }
                                    ]
                                }
                            ]
                        }] : []),
                        ...(promotion.validUntil ? [{
                            type: 'text',
                            text: `ใช้ได้ถึง: ${promotion.validUntil}`,
                            size: 'xs',
                            color: '#999999',
                            margin: 'md'
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
                                label: 'เลือกซื้อเลย',
                                uri: baseUrl
                            }
                        }
                    ]
                }
            }
        };

        return await this.shareTargetPicker([flexMessage]);
    }

    // Share app recommendation
    static async shareApp() {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

        const flexMessage: ShareMessage = {
            type: 'flex',
            altText: 'แนะนำ Nhamaew Pet Store',
            contents: {
                type: 'bubble',
                hero: {
                    type: 'image',
                    url: `${baseUrl}/images/nhamaew-icon.png`,
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
                            text: '🐱 Nhamaew Pet Store',
                            weight: 'bold',
                            size: 'xl'
                        },
                        {
                            type: 'text',
                            text: 'สินค้าสัตว์เลี้ยงโดยทีมสัตวแพทย์',
                            size: 'md',
                            color: '#666666',
                            wrap: true,
                            margin: 'md'
                        },
                        {
                            type: 'text',
                            text: '✅ คุณภาพดี มาตรฐานสูง\n✅ คำปรึกษาจากสัตวแพทย์\n✅ จัดส่งรวดเร็ว',
                            size: 'sm',
                            wrap: true,
                            margin: 'lg'
                        }
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
                                label: 'เริ่มช้อปปิ้ง',
                                uri: baseUrl
                            }
                        }
                    ]
                }
            }
        };

        return await this.shareTargetPicker([flexMessage]);
    }

    // Generic share target picker
    static async shareTargetPicker(messages: ShareMessage[]) {
        try {
            const result = await LiffUtils.shareTargetPicker(messages);
            return { success: true, result };
        } catch (error) {
            console.error('Share target picker failed:', error);
            return { success: false, error };
        }
    }

    // Send messages directly to the current chat
    static async sendMessages(messages: ShareMessage[]) {
        try {
            await LiffUtils.sendMessages(messages);
            return { success: true };
        } catch (error) {
            console.error('Send messages failed:', error);
            return { success: false, error };
        }
    }

    // Share simple text message
    static async shareText(text: string) {
        const textMessage: ShareMessage = {
            type: 'text',
            text
        };

        return await this.shareTargetPicker([textMessage]);
    }

    // Share image with text
    static async shareImage(imageUrl: string, text?: string) {
        const messages: ShareMessage[] = [];

        if (text) {
            messages.push({
                type: 'text',
                text
            });
        }

        messages.push({
            type: 'image',
            originalContentUrl: imageUrl,
            previewImageUrl: imageUrl
        });

        return await this.shareTargetPicker(messages);
    }

    // Check if sharing is available
    static canShare(): boolean {
        return LiffUtils.isInClient() && LiffUtils.isApiAvailable('shareTargetPicker');
    }

    // Check if send messages is available
    static canSendMessages(): boolean {
        return LiffUtils.isInClient() && LiffUtils.isApiAvailable('sendMessages');
    }
}

// Helper functions for common sharing scenarios
export const liffShare = {
    // Quick share product
    product: (product: any) => LiffShareUtils.shareProduct(product),

    // Quick share cart
    cart: (cart: any) => LiffShareUtils.shareCart(cart),

    // Quick share location
    location: (location: any) => LiffShareUtils.shareLocation(location),

    // Quick share promotion
    promotion: (promotion: any) => LiffShareUtils.sharePromotion(promotion),

    // Quick share app
    app: () => LiffShareUtils.shareApp(),

    // Quick share text
    text: (text: string) => LiffShareUtils.shareText(text),

    // Quick share image
    image: (imageUrl: string, text?: string) => LiffShareUtils.shareImage(imageUrl, text),

    // Check capabilities
    canShare: () => LiffShareUtils.canShare(),
    canSendMessages: () => LiffShareUtils.canSendMessages()
};

export default LiffShareUtils; 