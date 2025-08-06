"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { Liff } from '@line/liff';
import {
    LiffContextType,
    LiffState,
    LiffProfile,
    LiffContext as LiffContextData,
    LiffError,
    ShareMessage,
    ShareTargetPickerResult
} from '@/types/liff';

// Initial state
const initialState: LiffState = {
    liff: null,
    isInitialized: false,
    isLoggedIn: false,
    isInClient: false,
    profile: null,
    isLoading: false,
    error: null,
};

// Action types
type LiffAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_LIFF'; payload: Liff }
    | { type: 'SET_INITIALIZED'; payload: boolean }
    | { type: 'SET_LOGGED_IN'; payload: boolean }
    | { type: 'SET_IN_CLIENT'; payload: boolean }
    | { type: 'SET_PROFILE'; payload: LiffProfile | null }
    | { type: 'RESET' };

// Reducer
function liffReducer(state: LiffState, action: LiffAction): LiffState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_LIFF':
            return { ...state, liff: action.payload };
        case 'SET_INITIALIZED':
            return { ...state, isInitialized: action.payload };
        case 'SET_LOGGED_IN':
            return { ...state, isLoggedIn: action.payload };
        case 'SET_IN_CLIENT':
            return { ...state, isInClient: action.payload };
        case 'SET_PROFILE':
            return { ...state, profile: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

// Create context
const LiffContext = createContext<LiffContextType | null>(null);

// Provider component
interface LiffProviderProps {
    children: React.ReactNode;
}

export function LiffProvider({ children }: LiffProviderProps) {
    const [state, dispatch] = useReducer(liffReducer, initialState);
    const initializationAttempted = useRef(false);

    // Initialize LIFF
    const initialize = useCallback(async (liffId: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            // Dynamic import to avoid SSR issues
            const liff = (await import('@line/liff')).default;

            await liff.init({ liffId });

            dispatch({ type: 'SET_LIFF', payload: liff });
            dispatch({ type: 'SET_INITIALIZED', payload: true });
            dispatch({ type: 'SET_IN_CLIENT', payload: liff.isInClient() });

            if (liff.isLoggedIn()) {
                dispatch({ type: 'SET_LOGGED_IN', payload: true });
                const profile = await liff.getProfile();
                dispatch({ type: 'SET_PROFILE', payload: profile });
            }

        } catch (error) {
            const liffError = error as LiffError;
            dispatch({ type: 'SET_ERROR', payload: liffError.message });
            console.error('LIFF initialization failed:', liffError);
            // Reset the initialization attempt flag on error so it can be retried
            initializationAttempted.current = false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // Login
    const login = useCallback(async () => {
        if (!state.liff) {
            throw new Error('LIFF is not initialized');
        }

        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await state.liff.login();
            dispatch({ type: 'SET_LOGGED_IN', payload: true });

            const profile = await state.liff.getProfile();
            dispatch({ type: 'SET_PROFILE', payload: profile });
        } catch (error) {
            const liffError = error as LiffError;
            dispatch({ type: 'SET_ERROR', payload: liffError.message });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.liff]);

    // Logout
    const logout = useCallback(() => {
        if (!state.liff) return;

        state.liff.logout();
        dispatch({ type: 'SET_LOGGED_IN', payload: false });
        dispatch({ type: 'SET_PROFILE', payload: null });
    }, [state.liff]);

    // Share target picker
    const shareTargetPicker = useCallback(async (messages: ShareMessage[]): Promise<ShareTargetPickerResult | null> => {
        if (!state.liff) {
            throw new Error('LIFF is not initialized');
        }

        try {
            const result = await state.liff.shareTargetPicker(messages as any);
            return result || { status: 'success' };
        } catch (error) {
            console.error('Share target picker failed:', error);
            return null;
        }
    }, [state.liff]);

    // Send messages
    const sendMessages = useCallback(async (messages: ShareMessage[]) => {
        if (!state.liff) {
            throw new Error('LIFF is not initialized');
        }

        try {
            await state.liff.sendMessages(messages as any);
        } catch (error) {
            console.error('Send messages failed:', error);
            throw error;
        }
    }, [state.liff]);

    // Open window
    const openWindow = useCallback((url: string, external = false) => {
        if (!state.liff) return;

        state.liff.openWindow({
            url,
            external
        });
    }, [state.liff]);

    // Close window
    const closeWindow = useCallback(() => {
        if (!state.liff) return;
        state.liff.closeWindow();
    }, [state.liff]);

    // Get profile
    const getProfile = useCallback(async (): Promise<LiffProfile | null> => {
        if (!state.liff || !state.isLoggedIn) return null;

        try {
            const profile = await state.liff.getProfile();
            return profile;
        } catch (error) {
            console.error('Get profile failed:', error);
            return null;
        }
    }, [state.liff, state.isLoggedIn]);

    // Get context
    const getContext = useCallback((): LiffContextData | null => {
        if (!state.liff) return null;

        try {
            return state.liff.getContext() as LiffContextData;
        } catch (error) {
            console.error('Get context failed:', error);
            return null;
        }
    }, [state.liff]);

    // Get friendship status
    const getFriendship = useCallback(async () => {
        if (!state.liff || !state.isLoggedIn) return null;

        try {
            const friendship = await state.liff.getFriendship();
            return friendship;
        } catch (error) {
            console.error('Get friendship failed:', error);
            return null;
        }
    }, [state.liff, state.isLoggedIn]);

    // Get access token
    const getAccessToken = useCallback((): string | null => {
        if (!state.liff || !state.isLoggedIn) return null;

        try {
            return state.liff.getAccessToken();
        } catch (error) {
            console.error('Get access token failed:', error);
            return null;
        }
    }, [state.liff, state.isLoggedIn]);

    // Get ID token
    const getIDToken = useCallback((): string | null => {
        if (!state.liff || !state.isLoggedIn) return null;

        try {
            return state.liff.getIDToken();
        } catch (error) {
            console.error('Get ID token failed:', error);
            return null;
        }
    }, [state.liff, state.isLoggedIn]);

    // Get decoded ID token
    const getDecodedIDToken = useCallback((): any | null => {
        if (!state.liff || !state.isLoggedIn) return null;

        try {
            return state.liff.getDecodedIDToken();
        } catch (error) {
            console.error('Get decoded ID token failed:', error);
            return null;
        }
    }, [state.liff, state.isLoggedIn]);

    // Check API availability
    const isApiAvailable = useCallback((apiName: string): boolean => {
        if (!state.liff) return false;

        try {
            return state.liff.isApiAvailable(apiName);
        } catch (error) {
            console.error('Check API availability failed:', error);
            return false;
        }
    }, [state.liff]);

    // Auto-initialize LIFF when environment variable is available
    useEffect(() => {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (liffId && !initializationAttempted.current && !state.isInitialized && !state.isLoading) {
            initializationAttempted.current = true;
            initialize(liffId);
        }
    }, [initialize, state.isInitialized, state.isLoading]);

    const contextValue: LiffContextType = {
        ...state,
        initialize,
        login,
        logout,
        shareTargetPicker,
        sendMessages,
        openWindow,
        closeWindow,
        getProfile,
        getContext,
        getFriendship,
        getAccessToken,
        getIDToken,
        getDecodedIDToken,
        isApiAvailable,
    };

    return (
        <LiffContext.Provider value={contextValue}>
            {children}
        </LiffContext.Provider>
    );
}

// Hook to use LIFF context
export function useLiffContext(): LiffContextType {
    const context = useContext(LiffContext);
    if (!context) {
        throw new Error('useLiffContext must be used within a LiffProvider');
    }
    return context;
} 