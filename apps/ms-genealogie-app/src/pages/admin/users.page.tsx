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
import { useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { AppUser } from '@/domains/users/types';
import { useChangePassword, useUsers } from '@/domains/users/useUsers';

const { Title } = Typography;

const AdminUsersPage: NextPage = () => {
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
                        messageApi.success(`Mot de passe de "${selectedUser.username}" mis à jour`);
                        setSelectedUser(null);
                    },
                    onError: () => {
                        messageApi.error('Impossible de changer le mot de passe');
                    },
                },
            );
        });
    };

    const columns: ColumnsType<AppUser> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Utilisateur',
            dataIndex: 'username',
            render: (name: string) => (
                <Space>
                    <UserOutlined />
                    {name}
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (email: string | null) => email ?? <Tag color="default">—</Tag>,
        },
        {
            title: 'Rôle',
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
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: AppUser) => (
                <Tooltip title="Réinitialiser le mot de passe">
                    <Button
                        icon={<KeyOutlined />}
                        size="small"
                        onClick={() => handleResetPassword(record)}
                    >
                        Réinitialiser
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
                        Gestion des Utilisateurs
                    </Title>
                </Space>

                <Table
                    dataSource={users}
                    columns={columns}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 20, showTotal: (total) => `${total} utilisateur${total > 1 ? 's' : ''}` }}
                    locale={{ emptyText: 'Aucun utilisateur enregistré' }}
                    scroll={{ x: 'max-content' }}
                />
            </Space>

            <Modal
                title={`Réinitialiser le mot de passe — ${selectedUser?.username}`}
                open={!!selectedUser}
                onOk={handleConfirm}
                onCancel={() => setSelectedUser(null)}
                confirmLoading={isPending}
                okText="Confirmer"
                cancelText="Annuler"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="newPassword"
                        label="Nouveau mot de passe"
                        rules={[
                            { required: true, message: 'Mot de passe requis' },
                            { min: 6, message: 'Minimum 6 caractères' },
                        ]}
                    >
                        <Input.Password placeholder="Nouveau mot de passe" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Confirmation requise' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Les mots de passe ne correspondent pas');
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirmer le mot de passe" />
                    </Form.Item>
                </Form>
            </Modal>
        </ProtectedRoute>
    );
};

export default AdminUsersPage;
