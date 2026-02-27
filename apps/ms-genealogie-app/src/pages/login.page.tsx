import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuthContext } from '@/contexts/AuthContext';
import type { AuthUser } from '@/contexts/AuthContext';
import type { LoginPayload } from '@/domains/auth/types';
import { useLogin } from '@/domains/auth/useAuth';
import styles from '@/styles/auth.module.scss';

const { Title, Text } = Typography;

const CARD_STYLE = {
    width: 420,
    borderRadius: 16,
    boxShadow: '0 24px 64px rgba(194, 65, 12, 0.3)',
};

const CARD_BODY_STYLE = { padding: '40px 40px 32px' };

const LoginPage: NextPage = () => {
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
                            MS Généalogie
                        </Title>
                        <Text type="secondary">Connectez-vous à votre compte</Text>
                    </div>

                    {!!error && (
                        <Alert
                            message="Identifiants invalides"
                            description="Vérifiez votre nom d'utilisateur et votre mot de passe."
                            type="error"
                            showIcon
                        />
                    )}

                    <Form layout="vertical" onFinish={onFinish} size="large">
                        <Form.Item
                            name="username"
                            label="Nom d'utilisateur"
                            rules={[{ required: true, message: "Le nom d'utilisateur est requis" }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Votre identifiant" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            rules={[{ required: true, message: 'Le mot de passe est requis' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Votre mot de passe" />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 12 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isPending}
                                block
                                className={styles.submitButton}
                            >
                                Se connecter
                            </Button>
                        </Form.Item>

                        <div className={styles.footer}>
                            <Text type="secondary">Pas encore de compte ?&nbsp;</Text>
                            <Button type="link" style={{ padding: 0 }} onClick={() => router.push('/register')}>
                                {"S'inscrire"}
                            </Button>
                        </div>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default LoginPage;
