import type { Liff } from '@line/liff';
import { LiffProfile, LiffContext, ShareMessage } from '@/types/liff';

// LIFF utility functions
export class LiffUtils {
    private static liff: Liff | null = null;

    // Get LIFF instance
    static getLiff(): Liff | null {
        return this.liff;
    }

    // Set LIFF instance
    static setLiff(liff: Liff): void {
        this.liff = liff;
    }

    // Check if running in LIFF browser
    static isInClient(): boolean {
        return this.liff ? this.liff.isInClient() : false;
    }

    // Check if user is logged in
    static isLoggedIn(): boolean {
        return this.liff ? this.liff.isLoggedIn() : false;
    }

    // Get user profile
    static async getProfile(): Promise<LiffProfile | null> {
        if (!this.liff || !this.isLoggedIn()) {
            return null;
        }

        try {
            const profile = await this.liff.getProfile();
            return profile as LiffProfile;
        } catch (error) {
            console.error('Failed to get profile:', error);
            return null;
        }
    }

    // Get LIFF context
    static getContext(): LiffContext | null {
        if (!this.liff) {
            return null;
        }

        try {
            return this.liff.getContext() as LiffContext;
        } catch (error) {
            console.error('Failed to get context:', error);
            return null;
        }
    }

    // Check if specific API is available
    static isApiAvailable(apiName: string): boolean {
        return this.liff ? this.liff.isApiAvailable(apiName) : false;
    }

    // Get access token
    static getAccessToken(): string | null {
        if (!this.liff || !this.isLoggedIn()) {
            return null;
        }

        try {
            return this.liff.getAccessToken();
        } catch (error) {
            console.error('Failed to get access token:', error);
            return null;
        }
    }

    // Get ID token
    static getIDToken(): string | null {
        if (!this.liff || !this.isLoggedIn()) {
            return null;
        }

        try {
            return this.liff.getIDToken();
        } catch (error) {
            console.error('Failed to get ID token:', error);
            return null;
        }
    }

    // Get decoded ID token
    static getDecodedIDToken(): any | null {
        if (!this.liff || !this.isLoggedIn()) {
            return null;
        }

        try {
            return this.liff.getDecodedIDToken();
        } catch (error) {
            console.error('Failed to get decoded ID token:', error);
            return null;
        }
    }

    // Login
    static async login(redirectUri?: string): Promise<void> {
        if (!this.liff) {
            throw new Error('LIFF is not initialized');
        }

        try {
            await this.liff.login({ redirectUri });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    // Logout
    static logout(): void {
        if (this.liff) {
            this.liff.logout();
        }
    }

    // Open window
    static openWindow(url: string, external = false): void {
        if (this.liff) {
            this.liff.openWindow({
                url,
                external
            });
        }
    }

    // Close window
    static closeWindow(): void {
        if (this.liff) {
            this.liff.closeWindow();
        }
    }

    // Send messages
    static async sendMessages(messages: ShareMessage[]): Promise<void> {
        if (!this.liff) {
            throw new Error('LIFF is not initialized');
        }

        try {
            await this.liff.sendMessages(messages as any);
        } catch (error) {
            console.error('Failed to send messages:', error);
            throw error;
        }
    }

    // Share target picker
    static async shareTargetPicker(messages: ShareMessage[]): Promise<any> {
        if (!this.liff) {
            throw new Error('LIFF is not initialized');
        }

        try {
            return await this.liff.shareTargetPicker(messages as any);
        } catch (error) {
            console.error('Share target picker failed:', error);
            throw error;
        }
    }

    // Get friendship status
    static async getFriendship(): Promise<{ friendFlag: boolean } | null> {
        if (!this.liff || !this.isLoggedIn()) {
            return null;
        }

        try {
            return await this.liff.getFriendship();
        } catch (error) {
            console.error('Failed to get friendship status:', error);
            return null;
        }
    }

    // Check if user is in group/room context
    static isInGroupContext(): boolean {
        const context = this.getContext();
        return context ? ['group', 'room'].includes(context.type) : false;
    }

    // Check if user is in 1:1 chat context
    static isInOneToOneContext(): boolean {
        const context = this.getContext();
        return context ? context.type === 'utou' : false;
    }

    // Check if running in external browser
    static isInExternalContext(): boolean {
        const context = this.getContext();
        return context ? context.type === 'external' : false;
    }

    // Get user ID from context or profile
    static async getUserId(): Promise<string | null> {
        const context = this.getContext();
        if (context && context.userId) {
            return context.userId;
        }

        const profile = await this.getProfile();
        return profile ? profile.userId : null;
    }

    // Create text message object
    static createTextMessage(text: string): ShareMessage {
        return {
            type: 'text',
            text
        };
    }

    // Create image message object
    static createImageMessage(originalContentUrl: string, previewImageUrl: string): ShareMessage {
        return {
            type: 'image',
            originalContentUrl,
            previewImageUrl
        };
    }

    // Create location message object
    static createLocationMessage(
        title: string,
        address: string,
        latitude: number,
        longitude: number
    ): ShareMessage {
        return {
            type: 'location',
            title,
            address,
            latitude,
            longitude
        };
    }

    // Create sticker message object
    static createStickerMessage(packageId: string, stickerId: string): ShareMessage {
        return {
            type: 'sticker',
            packageId,
            stickerId
        };
    }

    // Create flex message object
    static createFlexMessage(altText: string, contents: any): ShareMessage {
        return {
            type: 'flex',
            altText,
            contents
        };
    }
}

// Helper functions for common use cases
export const liffUtils = {
    // Initialize LIFF and return instance
    init: async (liffId: string): Promise<Liff> => {
        const liff = (await import('@line/liff')).default;
        await liff.init({ liffId });
        LiffUtils.setLiff(liff);
        return liff;
    },

    // Get environment-specific LIFF ID
    getLiffId: (): string | null => {
        return process.env.NEXT_PUBLIC_LIFF_ID || null;
    },

    // Check if LIFF ID is configured
    isConfigured: (): boolean => {
        return !!process.env.NEXT_PUBLIC_LIFF_ID;
    },

    // Safe initialization with error handling
    safeInit: async (liffId?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const id = liffId || liffUtils.getLiffId();
            if (!id) {
                return { success: false, error: 'LIFF ID not configured' };
            }

            await liffUtils.init(id);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
};

export default LiffUtils; 