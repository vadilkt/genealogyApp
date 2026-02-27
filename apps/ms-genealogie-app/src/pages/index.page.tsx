import {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    TeamOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import {
    Typography,
    Input,
    Button,
    Table,
    Tag,
    Space,
    Popconfirm,
    Alert,
    Tooltip,
    Card,
    Statistic,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { DEFAULT_PAGE_SIZE } from '@/consts';
import type { Profile } from '@/domains/profiles/types';
import { useSearchProfiles, useDeleteProfile } from '@/domains/profiles/useProfiles';
import { formatDateShort } from '@/utils/formatDate';

const { Title, Text } = Typography;

const DashboardContent = () => {
    const { isAdmin } = useAuthContext();
    const router = useRouter();
    const [keyword, setKeyword] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const { data: profiles = [], isFetching, refetch } = useSearchProfiles(keyword || undefined);
    const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile();

    const handleSearch = useCallback(() => {
        setKeyword(searchValue.trim());
    }, [searchValue]);

    const handleDelete = useCallback(
        (id: number) => {
            deleteProfile(id, {
                onSuccess: () => refetch(),
            });
        },
        [deleteProfile, refetch],
    );

    const columns: ColumnsType<Profile> = [
        {
            title: 'Nom complet',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <UserOutlined />
                    <Text strong>
                        {record.firstName} {record.lastName}
                    </Text>
                </Space>
            ),
            sorter: (a, b) =>
                `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`),
        },
        {
            title: 'Genre',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender: string) => (
                <Tag color={gender === 'MALE' ? 'blue' : 'pink'}>
                    {gender === 'MALE' ? 'Homme' : 'Femme'}
                </Tag>
            ),
            filters: [
                { text: 'Homme', value: 'MALE' },
                { text: 'Femme', value: 'FEMALE' },
            ],
            onFilter: (value, record) => record.gender === value,
        },
        {
            title: 'Date de naissance',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (val: string) => formatDateShort(val),
            sorter: (a, b) =>
                new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
        },
        {
            title: 'Décès',
            dataIndex: 'dateOfDeath',
            key: 'dateOfDeath',
            render: (val: string | null) =>
                val ? (
                    <Tag color="default">{formatDateShort(val)}</Tag>
                ) : (
                    <Tag color="green">Vivant(e)</Tag>
                ),
        },
        {
            title: 'Résidence',
            dataIndex: 'residence',
            key: 'residence',
            render: (val: string) => val || '—',
        },
        {
            title: 'Lieu de naissance',
            key: 'birthPlace',
            render: (_, record) =>
                record.birthPlace
                    ? `${record.birthPlace.city}, ${record.birthPlace.country}`
                    : '—',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Voir le profil">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => router.push(`/profiles/${record.id}`)}
                        />
                    </Tooltip>
                    {isAdmin && (
                        <Popconfirm
                            title="Supprimer ce profil ?"
                            description="Cette action est irréversible."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{ danger: true, loading: isDeleting }}
                        >
                            <Tooltip title="Supprimer">
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    danger
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const activeProfiles = profiles.filter((p) => !p.dateOfDeath);
    const deceasedProfiles = profiles.filter((p) => p.dateOfDeath);

    return (
        <div>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 24,
                }}
            >
                <div>
                    <Title level={3} style={{ marginBottom: 4 }}>
                        {isAdmin ? 'Gestion des Profils' : 'Liste des Profils'}
                    </Title>
                    <Text type="secondary">
                        {profiles.length} profil{profiles.length > 1 ? 's' : ''} trouvé
                        {profiles.length > 1 ? 's' : ''}
                    </Text>
                </div>
                {isAdmin && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/profiles/new')}
                        size="large"
                    >
                        Nouveau profil
                    </Button>
                )}
            </div>

            {/* Bannière info pour les utilisateurs non-admin */}
            {!isAdmin && (
                <Alert
                    message="Mode consultation"
                    description="Vous consultez les profils en lecture seule. Contactez un administrateur pour effectuer des modifications."
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Statistiques rapides (admin) */}
            {isAdmin && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <Card size="small" style={{ flex: 1 }}>
                        <Statistic
                            title="Total"
                            value={profiles.length}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                    <Card size="small" style={{ flex: 1 }}>
                        <Statistic
                            title="Vivants"
                            value={activeProfiles.length}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                    <Card size="small" style={{ flex: 1 }}>
                        <Statistic
                            title="Décédés"
                            value={deceasedProfiles.length}
                            valueStyle={{ color: '#8c8c8c' }}
                        />
                    </Card>
                </div>
            )}

            {/* Barre de recherche */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <Input
                    placeholder="Rechercher par nom, prénom..."
                    prefix={<SearchOutlined />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ maxWidth: 400 }}
                    allowClear
                    onClear={() => {
                        setSearchValue('');
                        setKeyword('');
                    }}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    Rechercher
                </Button>
            </div>

            {/* Table */}
            <Table
                dataSource={profiles}
                columns={columns}
                rowKey="id"
                loading={isFetching}
                onRow={(record) => ({
                    onClick: (e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('button') || target.closest('.ant-btn')) return;
                        router.push(`/profiles/${record.id}`);
                    },
                    style: { cursor: 'pointer' },
                })}
                pagination={{
                    pageSize: DEFAULT_PAGE_SIZE,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '25', '50'],
                    showTotal: (total) => `${total} profil${total > 1 ? 's' : ''}`,
                }}
                bordered={false}
                style={{ background: '#fff', borderRadius: 8 }}
            />
        </div>
    );
};

const DashboardPage: NextPage = () => (
    <ProtectedRoute>
        <DashboardContent />
    </ProtectedRoute>
);

export default DashboardPage;
