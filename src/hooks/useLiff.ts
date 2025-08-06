"use client";

import { useLiffContext as useLiffContextProvider } from '@/contexts/LiffContext';
import { useEffect, useCallback, useState } from 'react';
import { LiffProfile, LiffContext, ShareMessage } from '@/types/liff';

// Main LIFF hook
export function useLiff() {
    const liffContext = useLiffContextProvider();

    // The context handles auto-initialization, so we don't need to do it here
    return liffContext;
}

// Hook for user profile
export function useLiffProfile(): {
    profile: LiffProfile | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
} {
    const { profile, isLoading, error, getProfile, isLoggedIn } = useLiff();

    const refetch = useCallback(async () => {
        if (isLoggedIn) {
            await getProfile();
        }
    }, [getProfile, isLoggedIn]);

    return {
        profile,
        isLoading,
        error,
        refetch
    };
}

// Hook for LIFF context information
export function useLiffContextInfo(): {
    context: LiffContext | null;
    isInClient: boolean;
    isInGroup: boolean;
    isInOneToOne: boolean;
    isExternal: boolean;
} {
    const { getContext, isInClient } = useLiff();
    const context = getContext();

    return {
        context,
        isInClient,
        isInGroup: context ? ['group', 'room'].includes(context.type) : false,
        isInOneToOne: context ? context.type === 'utou' : false,
        isExternal: context ? context.type === 'external' : false
    };
}

// Hook for authentication
export function useLiffAuth(): {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    profile: LiffProfile | null;
} {
    const { isLoggedIn, isLoading, login, logout, profile } = useLiff();

    return {
        isLoggedIn,
        isLoading,
        login,
        logout,
        profile
    };
}

// Hook for sharing functionality
export function useLiffShare(): {
    shareTargetPicker: (messages: ShareMessage[]) => Promise<boolean>;
    sendMessages: (messages: ShareMessage[]) => Promise<void>;
    canShare: boolean;
} {
    const { shareTargetPicker, sendMessages, isApiAvailable, isInClient } = useLiff();

    const handleShareTargetPicker = useCallback(async (messages: ShareMessage[]): Promise<boolean> => {
        try {
            const result = await shareTargetPicker(messages);
            return !!result;
        } catch (error) {
            console.error('Share failed:', error);
            return false;
        }
    }, [shareTargetPicker]);

    return {
        shareTargetPicker: handleShareTargetPicker,
        sendMessages,
        canShare: isInClient && isApiAvailable('shareTargetPicker')
    };
}

// Hook for window operations
export function useLiffWindow(): {
    openWindow: (url: string, external?: boolean) => void;
    closeWindow: () => void;
    canOpenWindow: boolean;
} {
    const { openWindow, closeWindow, isApiAvailable, isInClient } = useLiff();

    return {
        openWindow,
        closeWindow,
        canOpenWindow: isInClient && isApiAvailable('openWindow')
    };
}

// Hook for tokens and authentication data
export function useLiffTokens(): {
    accessToken: string | null;
    idToken: string | null;
    decodedIdToken: any | null;
    getAccessToken: () => string | null;
    getIDToken: () => string | null;
    getDecodedIDToken: () => any | null;
} {
    const { getAccessToken, getIDToken, getDecodedIDToken } = useLiff();

    return {
        accessToken: getAccessToken(),
        idToken: getIDToken(),
        decodedIdToken: getDecodedIDToken(),
        getAccessToken,
        getIDToken,
        getDecodedIDToken
    };
}

// Hook for friendship status
export function useLiffFriendship(): {
    isFriend: boolean | null;
    isLoading: boolean;
    checkFriendship: () => Promise<void>;
} {
    const { getFriendship, isLoggedIn } = useLiff();
    const [isFriend, setIsFriend] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkFriendship = useCallback(async () => {
        if (!isLoggedIn) return;

        setIsLoading(true);
        try {
            const friendship = await getFriendship();
            setIsFriend(friendship ? friendship.friendFlag : null);
        } catch (error) {
            console.error('Failed to check friendship:', error);
            setIsFriend(null);
        } finally {
            setIsLoading(false);
        }
    }, [getFriendship, isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            checkFriendship();
        }
    }, [isLoggedIn, checkFriendship]);

    return {
        isFriend,
        isLoading,
        checkFriendship
    };
}

// Message helper hooks
export function useLiffMessages() {
    const { sendMessages } = useLiff();

    const sendText = useCallback(async (text: string) => {
        await sendMessages([{ type: 'text', text }]);
    }, [sendMessages]);

    const sendImage = useCallback(async (originalContentUrl: string, previewImageUrl: string) => {
        await sendMessages([{
            type: 'image',
            originalContentUrl,
            previewImageUrl
        }]);
    }, [sendMessages]);

    const sendLocation = useCallback(async (
        title: string,
        address: string,
        latitude: number,
        longitude: number
    ) => {
        await sendMessages([{
            type: 'location',
            title,
            address,
            latitude,
            longitude
        }]);
    }, [sendMessages]);

    const sendSticker = useCallback(async (packageId: string, stickerId: string) => {
        await sendMessages([{
            type: 'sticker',
            packageId,
            stickerId
        }]);
    }, [sendMessages]);

    const sendFlex = useCallback(async (altText: string, contents: any) => {
        await sendMessages([{
            type: 'flex',
            altText,
            contents
        }]);
    }, [sendMessages]);

    return {
        sendText,
        sendImage,
        sendLocation,
        sendSticker,
        sendFlex,
        sendMessages
    };
}



// Default export
export default useLiff; 