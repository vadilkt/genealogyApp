import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuthContext } from '@/contexts/AuthContext';
import type { AuthUser } from '@/contexts/AuthContext';
import type { LoginPayload } from '@/domains/auth/types';
import { useLogin } from '@/domains/auth/useAuth';
import styles from '@/styles/auth.module.scss';

const { Title, Text } = Typography;

const CARD_STYLE = {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    boxShadow: '0 24px 64px rgba(194, 65, 12, 0.3)',
};

const CARD_BODY_STYLE = { padding: '32px 28px' };

const LoginPage: NextPage = () => {
    const { t } = useTranslation('common');
    const { isAuthenticated, setAuth } = useAuthContext();
    const router = useRouter();
    const { mutate: login, isPending, error } = useLogin();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, router]);

    const onFinish = (values: LoginPayload) => {
        login(values, {
            onSuccess: (data) => {
                const user: AuthUser = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                };
                setAuth(data.jwt, user);
                router.push('/');
            },
        });
    };

    return (
        <div className={styles.page}>
            <Card className={styles.card} style={CARD_STYLE} styles={{ body: CARD_BODY_STYLE }}>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    <div className={styles.header}>
                        <Title level={2} style={{ marginBottom: 4 }}>
                            {t('appName')}
                        </Title>
                        <Text type="secondary">{t('auth.loginSubtitle')}</Text>
                    </div>

                    {!!error && (
                        <Alert
                            message={t('auth.loginError')}
                            description={t('auth.loginErrorDesc')}
                            type="error"
                            showIcon
                        />
                    )}

                    <Form layout="vertical" onFinish={onFinish} size="large">
                        <Form.Item
                            name="username"
                            label={t('auth.username')}
                            rules={[{ required: true, message: t('auth.usernameRequired') }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder={t('auth.usernamePlaceholder')} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={t('auth.password')}
                            rules={[{ required: true, message: t('auth.passwordRequired') }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.passwordPlaceholder')} />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 12 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isPending}
                                block
                                className={styles.submitButton}
                            >
                                {t('auth.signIn')}
                            </Button>
                        </Form.Item>

                        <div className={styles.footer}>
                            <Text type="secondary">{t('auth.noAccount')}&nbsp;</Text>
                            <Button type="link" style={{ padding: 0 }} onClick={() => router.push('/register')}>
                                {t('auth.signUp')}
                            </Button>
                        </div>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default LoginPage;
