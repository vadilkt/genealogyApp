import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Space, Typography, message } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { UserRole } from '@/domains/auth/types';
import type { RegisterPayload } from '@/domains/auth/types';
import { useRegister } from '@/domains/auth/useAuth';
import styles from '@/styles/auth.module.scss';

const { Title, Text } = Typography;

const REDIRECT_DELAY_MS = 1200;

const CARD_STYLE = {
    width: 460,
    borderRadius: 16,
    boxShadow: '0 24px 64px rgba(194, 65, 12, 0.3)',
};

const CARD_BODY_STYLE = { padding: '40px 40px 32px' };

const RegisterPage: NextPage = () => {
    const router = useRouter();
    const { mutate: register, isPending, error } = useRegister();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values: Omit<RegisterPayload, 'role'>) => {
        register(
            { ...values, role: UserRole.USER },
            {
                onSuccess: () => {
                    messageApi.success('Compte créé avec succès !');
                    setTimeout(() => router.push('/login'), REDIRECT_DELAY_MS);
                },
            },
        );
    };

    return (
        <div className={styles.page}>
            {contextHolder}
            <Card className={styles.card} style={CARD_STYLE} styles={{ body: CARD_BODY_STYLE }}>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    <div className={styles.header}>
                        <Title level={2} style={{ marginBottom: 4 }}>
                            Créer un compte
                        </Title>
                        <Text type="secondary">MS Généalogie — Inscription</Text>
                    </div>

                    {error && (
                        <Alert
                            message="Erreur lors de l'inscription"
                            description="Ce nom d'utilisateur est peut-être déjà pris."
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
                            <Input prefix={<UserOutlined />} placeholder="Choisissez un identifiant" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "L'email est requis" },
                                { type: 'email', message: 'Email invalide' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="votre@email.com" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            rules={[
                                { required: true, message: 'Le mot de passe est requis' },
                                { min: 6, message: 'Minimum 6 caractères' },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Choisissez un mot de passe"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 12 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isPending}
                                block
                                className={styles.submitButton}
                            >
                                Créer le compte
                            </Button>
                        </Form.Item>

                        <div className={styles.footer}>
                            <Text type="secondary">Déjà un compte ?&nbsp;</Text>
                            <Button type="link" style={{ padding: 0 }} onClick={() => router.push('/login')}>
                                Se connecter
                            </Button>
                        </div>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default RegisterPage;
