import type { CallbacksOptions } from 'next-auth';

export const authCallbacks: Partial<CallbacksOptions> = {
    async jwt({ token, user, account }) {
        if (account && user) {
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                accessTokenExpires: account.expires_at
                    ? account.expires_at * 1000
                    : Date.now() + 3600 * 1000,
                user,
            };
        }

        // Return previous token if the access token has not expired
        if (Date.now() < (token.accessTokenExpires as number)) {
            return token;
        }

        // Access token has expired, try to refresh it
        return token;
    },

    async session({ session, token }) {
        if (token) {
            session.user = token.user as typeof session.user;
            (session as Record<string, unknown>).accessToken = token.accessToken;
            (session as Record<string, unknown>).error = token.error;
        }
        return session;
    },
};
