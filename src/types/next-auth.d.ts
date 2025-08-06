import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            profileUpdated?: boolean;
            profileData?: any; // Store API response data
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        profileUpdated?: boolean;
        profileData?: any; // Store API response data
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        profileUpdated?: boolean;
        profileData?: any; // Store API response data
    }
} 