import type { Liff } from '@line/liff';

export interface LiffProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
}

export interface LiffContext {
    type: 'utou' | 'room' | 'group' | 'square_chat' | 'external' | 'none';
    viewType?: 'compact' | 'tall' | 'full' | 'frame' | 'full-flex';
    userId?: string;
    utouId?: string;
    roomId?: string;
    groupId?: string;
    squareChatId?: string;
    accessTokenHash: string;
}

export interface ShareTargetPickerResult {
    status: 'success';
}

export interface LiffData {
    language: string;
    context: LiffContext;
}

export interface LiffState {
    liff: Liff | null;
    isInitialized: boolean;
    isLoggedIn: boolean;
    isInClient: boolean;
    profile: LiffProfile | null;
    isLoading: boolean;
    error: string | null;
}

export interface LiffContextType extends LiffState {
    initialize: (liffId: string) => Promise<void>;
    login: () => Promise<void>;
    logout: () => void;
    shareTargetPicker: (messages: ShareMessage[]) => Promise<ShareTargetPickerResult | null>;
    sendMessages: (messages: ShareMessage[]) => Promise<void>;
    openWindow: (url: string, external?: boolean) => void;
    closeWindow: () => void;
    getProfile: () => Promise<LiffProfile | null>;
    getContext: () => LiffContext | null;
    getFriendship: () => Promise<{ friendFlag: boolean } | null>;
    getAccessToken: () => string | null;
    getIDToken: () => string | null;
    getDecodedIDToken: () => any | null;
    isApiAvailable: (apiName: string) => boolean;
}

export interface ShareMessage {
    type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'sticker' | 'imagemap' | 'template' | 'flex';
    text?: string;
    originalContentUrl?: string;
    previewImageUrl?: string;
    duration?: number;
    title?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    packageId?: string;
    stickerId?: string;
    baseUrl?: string;
    altText?: string;
    baseSize?: { width: number; height: number };
    template?: any;
    contents?: any;
}

export interface LiffError extends Error {
    code?: string;
    message: string;
} 