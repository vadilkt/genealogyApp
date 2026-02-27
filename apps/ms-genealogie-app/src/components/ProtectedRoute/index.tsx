import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { AppLayout } from '@/components/AppLayout';
import { useAuthContext } from '@/contexts/AuthContext';

import styles from './ProtectedRoute.module.scss';

interface ProtectedRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
    withLayout?: boolean;
}

export const ProtectedRoute = ({
    children,
    adminOnly = false,
    withLayout = true,
}: ProtectedRouteProps) => {
    const { isAuthenticated, isAdmin } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (adminOnly && !isAdmin) {
            router.replace('/');
        }
    }, [isAuthenticated, isAdmin, adminOnly, router]);

    if (!isAuthenticated) {
        return (
            <div className={styles.loadingWrapper}>
                <Spin size="large" />
            </div>
        );
    }

    if (adminOnly && !isAdmin) {
        return null;
    }

    if (withLayout) {
        return <AppLayout>{children}</AppLayout>;
    }

    return <>{children}</>;
};
