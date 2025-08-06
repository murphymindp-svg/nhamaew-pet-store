import { NextAuthOptions } from "next-auth";
import LINE from "next-auth/providers/line";
import axios from "axios";
import api from "@/utils/api";

// Configure NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    LINE({
      clientId: String(process.env.LINE_CLIENT_ID),
      clientSecret: String(process.env.LINE_CLIENT_SECRET),
      authorization: {
        params: { scope: "profile openid email", bot_prompt: "aggressive" }
      },
      profile: (profile) => {
        return {
          id: profile.sub,
          name: profile?.name,
          email: profile?.email,
          image: profile.picture
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // This runs after successful signin but before JWT/session creation
      if (account?.provider === "line" && user) {
        try {

          const getUserData = await api.get(`/api/pet-store/v1/get-line-profile/${user.id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            // Optional: Set timeout
            timeout: 10000, // 10 seconds
          });

          // Call your register/update profile API using axios
          const response = await api.post(`/api/pet-store/v1/register-update-profile`, {
            lineUserId: user.id,
            displayName: user.name || "",
            pictureUrl: user.image || "",
            gender: getUserData.data.gender ?? "", // Will be empty on first signin
            birthDate: getUserData.data.birthDate ?? "", // Will be empty on first signin
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            // Optional: Set timeout
            timeout: 10000, // 10 seconds
          });

          // Optionally store additional data in user object
          user.profileUpdated = true;
          user.profileData = response.data; // Store API response if needed

        } catch (error) {
          user.profileUpdated = false;
        }
      }

      return true; // Allow signin
    },
    async jwt({ token, user, account, trigger, session }: any) {
      // When user first signs in, add the user id to the token
      if (user) {
        token.id = user.id;
        token.profileUpdated = user.profileUpdated;
        token.profileData = user.profileData; // Store profile data if needed
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the user id from token to session
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.profileUpdated = token.profileUpdated;
        session.user.profileData = token.profileData; // Pass profile data to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};
