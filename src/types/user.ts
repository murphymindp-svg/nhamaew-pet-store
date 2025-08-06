/**
 * Interface for register/update profile request
 */
export interface RegisterUpdateProfileRequest {
    lineUserId: string;
    displayName?: string;
    pictureUrl?: string;
    gender?: string;
    birthDate?: string;
}

/**
 * Interface for register/update profile response
 */
export interface RegisterUpdateProfileResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * Interface for get LINE profile request
 */
export interface GetLineProfileRequest {
    lineUserId: string;
}

/**
 * Interface for LINE profile data
 */
export interface LineProfileData {
    userId: string;
    displayName: string;
    pictureUrl: string;
    statusMessage?: string;
    gender?: string;
    birthDate?: string;
}

/**
 * Interface for get LINE profile response
 */
export interface GetLineProfileResponse {
    success: boolean;
    message: string;
    data?: LineProfileData;
}

/**
 * Interface for user profile data
 */
export interface UserProfile {
    id: string;
    lineUserId: string;
    displayName: string;
    pictureUrl: string;
    gender: string;
    birthDate: string;
    createdAt?: string;
    updatedAt?: string;
} 