import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useState } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';

import '@/styles/globals.scss';

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1,
                        staleTime: 5 * 60 * 1000,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                locale={frFR}
                theme={{
                    token: {
                        colorPrimary: '#e67e22',
                        colorLink: '#e67e22',
                        borderRadius: 10,
                        borderRadiusLG: 14,
                        colorBgLayout: '#fdf4e8',
                        colorBgContainer: '#fffaf3',
                        motionDurationMid: '0.25s',
                        motionDurationSlow: '0.35s',
                        motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    components: {
                        Menu: {
                            darkItemBg: '#2d1a0e',
                            darkSubMenuItemBg: '#1e1108',
                            darkItemSelectedBg: '#e67e22',
                            darkItemHoverBg: '#3d2510',
                        },
                        Layout: {
                            headerBg: '#fffaf3',
                            bodyBg: '#fdf4e8',
                        },
                    },
                }}
            >
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
            </ConfigProvider>
        </QueryClientProvider>
    );
}

export default appWithTranslation(App);
