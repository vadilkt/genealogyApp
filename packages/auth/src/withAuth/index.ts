import { useSession, signIn } from 'next-auth/react';
import type { ComponentType } from 'react';
import React, { useEffect } from 'react';

export interface WithAuthOptions {
    redirectTo?: string;
    LoadingComponent?: ComponentType;
}

export function withAuth<P extends Record<string, unknown>>(
    WrappedComponent: ComponentType<P>,
    options: WithAuthOptions = {},
) {
    const { redirectTo = '/auth/signin', LoadingComponent } = options;

    const WithAuthComponent = (props: P) => {
        const { data: session, status } = useSession();
        const loading = status === 'loading';

        useEffect(() => {
            if (!loading && !session) {
                signIn(undefined, { callbackUrl: redirectTo });
            }
        }, [session, loading]);

        if (loading) {
            if (LoadingComponent) {
                return <LoadingComponent />;
            }
            return null;
        }

        if (!session) {
            return null;
        }

        return <WrappedComponent { ...props } />;
    };

    WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'
        })`;

    return WithAuthComponent;
}
