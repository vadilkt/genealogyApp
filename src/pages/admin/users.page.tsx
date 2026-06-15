import { KeyOutlined, SafetyOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Modal,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { AppUser } from '@/domains/users/types';
import { useChangePassword, useUsers } from '@/domains/users/useUsers';

const { Title } = Typography;

const AdminUsersPage: NextPage = () => {
    const { t } = useTranslation('common');
    const { data: users = [], isLoading } = useUsers();
    const { mutate: changePassword, isPending } = useChangePassword();
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [form] = Form.useForm();

    const handleResetPassword = (user: AppUser) => {
        setSelectedUser(user);
        form.resetFields();
    };

    const handleConfirm = () => {
        form.validateFields().then(({ newPassword }) => {
            if (!selectedUser) return;
            changePassword(
                { userId: selectedUser.id, newPassword },
                {
                    onSuccess: () => {
                        messageApi.success(t('adminUsers.passwordUpdated', { user: selectedUser.username }));
                        setSelectedUser(null);
                    },
                    onError: () => {
                        messageApi.error(t('adminUsers.passwordError'));
                    },
                },
            );
        });
    };

    const columns: ColumnsType<AppUser> = [
        {
            title: t('adminUsers.colId'),
            dataIndex: 'id',
            width: 60,
        },
        {
            title: t('adminUsers.colUser'),
            dataIndex: 'username',
            render: (name: string) => (
                <Space>
                    <UserOutlined />
                    {name}
                </Space>
            ),
        },
        {
            title: t('adminUsers.colEmail'),
            dataIndex: 'email',
            render: (email: string | null) => email ?? <Tag color="default">—</Tag>,
        },
        {
            title: t('adminUsers.colRole'),
            dataIndex: 'role',
            render: (role: string) =>
                role === 'ADMIN' ? (
                    <Tag icon={<SafetyOutlined />} color="purple">
                        ADMIN
                    </Tag>
                ) : (
                    <Tag color="orange">USER</Tag>
                ),
        },
        {
            title: t('adminUsers.colActions'),
            key: 'actions',
            render: (_: unknown, record: AppUser) => (
                <Tooltip title={t('adminUsers.resetTooltip')}>
                    <Button
                        icon={<KeyOutlined />}
                        size="small"
                        onClick={() => handleResetPassword(record)}
                    >
                        {t('adminUsers.reset')}
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <ProtectedRoute adminOnly>
            {contextHolder}
            <Space direction="vertical" size={24} style={{ width: '100%', padding: '24px' }}>
                <Space align="center">
                    <TeamOutlined style={{ fontSize: 22, color: '#e67e22' }} />
                    <Title level={3} style={{ margin: 0 }}>
                        {t('adminUsers.title')}
                    </Title>
                </Space>

                <Table
                    dataSource={users}
                    columns={columns}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 20, showTotal: (total) => t('adminUsers.total', { count: total }) }}
                    locale={{ emptyText: t('adminUsers.empty') }}
                    scroll={{ x: 'max-content' }}
                />
            </Space>

            <Modal
                title={t('adminUsers.resetTitle', { user: selectedUser?.username ?? '' })}
                open={!!selectedUser}
                onOk={handleConfirm}
                onCancel={() => setSelectedUser(null)}
                confirmLoading={isPending}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="newPassword"
                        label={t('adminUsers.newPassword')}
                        rules={[
                            { required: true, message: t('adminUsers.passwordRequired') },
                            { min: 6, message: t('adminUsers.passwordMin') },
                        ]}
                    >
                        <Input.Password placeholder={t('adminUsers.newPassword')} />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label={t('adminUsers.confirmPassword')}
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: t('adminUsers.confirmRequired') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(t('adminUsers.passwordMismatch'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder={t('adminUsers.confirmPassword')} />
                    </Form.Item>
                </Form>
            </Modal>
        </ProtectedRoute>
    );
};

export default AdminUsersPage;
