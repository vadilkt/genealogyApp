import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Space, Typography, message } from 'antd';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { UserRole } from '@/domains/auth/types';
import type { RegisterPayload } from '@/domains/auth/types';
import { useRegister } from '@/domains/auth/useAuth';
import styles from '@/styles/auth.module.scss';

const { Title, Text } = Typography;

const REDIRECT_DELAY_MS = 1200;

const CARD_STYLE = {
    width: '100%',
    maxWidth: 460,
    borderRadius: 16,
    boxShadow: '0 24px 64px rgba(194, 65, 12, 0.3)',
};

const CARD_BODY_STYLE = { padding: '32px 28px' };

const RegisterPage: NextPage = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { mutate: register, isPending, error } = useRegister();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values: Omit<RegisterPayload, 'role'>) => {
        register(
            { ...values, role: UserRole.USER },
            {
                onSuccess: () => {
                    messageApi.success(t('auth.accountCreated'));
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
                            {t('auth.registerTitle')}
                        </Title>
                        <Text type="secondary">{t('auth.registerSubtitle')}</Text>
                    </div>

                    {!!error && (
                        <Alert
                            message={t('auth.registerError')}
                            description={t('auth.registerErrorDesc')}
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
                            <Input prefix={<UserOutlined />} placeholder={t('auth.usernamePlaceholderRegister')} />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label={t('auth.email')}
                            rules={[
                                { required: true, message: t('auth.emailRequired') },
                                { type: 'email', message: t('auth.emailInvalid') },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder={t('auth.emailPlaceholder')} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={t('auth.password')}
                            rules={[
                                { required: true, message: t('auth.passwordRequired') },
                                { min: 6, message: t('auth.passwordMin') },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder={t('auth.passwordPlaceholderRegister')}
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
                                {t('auth.createAccount')}
                            </Button>
                        </Form.Item>

                        <div className={styles.footer}>
                            <Text type="secondary">{t('auth.haveAccount')}&nbsp;</Text>
                            <Button type="link" style={{ padding: 0 }} onClick={() => router.push('/login')}>
                                {t('auth.signIn')}
                            </Button>
                        </div>
                    </Form>
                </Space>
            </Card>
        </div>
    );
};

export default RegisterPage;
