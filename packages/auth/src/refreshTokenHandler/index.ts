export interface RefreshTokenResult {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export const refreshAccessToken = async (
    refreshToken: string,
    tokenUrl: string,
    clientId: string,
    clientSecret: string,
): Promise<RefreshTokenResult> => {
    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to refresh token');
        }

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token ?? refreshToken,
            expiresAt: Date.now() + data.expires_in * 1000,
        };
    } catch (error) {
        throw new Error(`RefreshAccessTokenError: ${(error as Error).message}`);
    }
};
