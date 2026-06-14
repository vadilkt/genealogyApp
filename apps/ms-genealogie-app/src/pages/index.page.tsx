import {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    TeamOutlined,
    InfoCircleOutlined,
    ExportOutlined,
    ImportOutlined,
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
    Upload,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { DEFAULT_PAGE_SIZE } from '@/consts';
import type { Profile } from '@/domains/profiles/types';
import { useSearchProfiles, useDeleteProfile, useOrphanProfiles } from '@/domains/profiles/useProfiles';
import { downloadGedcom, importGedcom } from '@/domains/gedcom/api';
import { formatGenealogicalDate } from '@/utils/formatDate';

const { Title, Text } = Typography;

const DashboardContent = () => {
    const { t } = useTranslation('common');
    const { isAdmin } = useAuthContext();
    const router = useRouter();
    const [keyword, setKeyword] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const { data: profiles = [], isFetching, refetch } = useSearchProfiles(keyword || undefined);
    const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile();
    const { data: orphans = [] } = useOrphanProfiles(isAdmin);
    const [messageApi, contextHolder] = message.useMessage();

    const handleExportGedcom = async () => {
        try {
            await downloadGedcom();
        } catch {
            messageApi.error(t('gedcom.exportError'));
        }
    };

    const handleImportGedcom = async (file: File) => {
        try {
            const created = await importGedcom(await file.text());
            messageApi.success(t('gedcom.importSuccess', { count: created }));
            refetch();
        } catch {
            messageApi.error(t('gedcom.importError'));
        }
        return false; // empêche l'upload automatique d'Ant Design
    };

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
            title: t('home.colName'),
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
            title: t('home.colGender'),
            dataIndex: 'gender',
            key: 'gender',
            render: (gender: string) => (
                <Tag color={gender === 'MALE' ? 'blue' : 'pink'}>
                    {gender === 'MALE' ? t('common.male') : t('common.female')}
                </Tag>
            ),
            filters: [
                { text: t('common.male'), value: 'MALE' },
                { text: t('common.female'), value: 'FEMALE' },
            ],
            onFilter: (value, record) => record.gender === value,
        },
        {
            title: t('home.colBirth'),
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (_, record) =>
                formatGenealogicalDate(record.dateOfBirth, record.birthDateQualifier, record.birthDatePrecision),
            sorter: (a, b) =>
                new Date(a.dateOfBirth ?? 0).getTime() - new Date(b.dateOfBirth ?? 0).getTime(),
        },
        {
            title: t('home.colDeath'),
            dataIndex: 'dateOfDeath',
            key: 'dateOfDeath',
            render: (_, record) =>
                record.dateOfDeath ? (
                    <Tag color="default">
                        {formatGenealogicalDate(record.dateOfDeath, record.deathDateQualifier, record.deathDatePrecision)}
                    </Tag>
                ) : (
                    <Tag color="green">{t('common.living')}</Tag>
                ),
        },
        {
            title: t('home.colResidence'),
            dataIndex: 'residence',
            key: 'residence',
            render: (val: string) => val || '—',
        },
        {
            title: t('home.colBirthPlace'),
            key: 'birthPlace',
            render: (_, record) =>
                record.birthPlace
                    ? `${record.birthPlace.city}, ${record.birthPlace.country}`
                    : '—',
        },
        {
            title: t('home.colActions'),
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title={t('home.viewProfile')}>
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => router.push(`/profiles/${record.id}`)}
                        />
                    </Tooltip>
                    {isAdmin && (
                        <Popconfirm
                            title={t('home.deleteConfirm')}
                            description={t('home.deleteIrreversible')}
                            onConfirm={() => handleDelete(record.id)}
                            okText={t('common.delete')}
                            cancelText={t('common.cancel')}
                            okButtonProps={{ danger: true, loading: isDeleting }}
                        >
                            <Tooltip title={t('common.delete')}>
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
            {contextHolder}
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
                        {isAdmin ? t('home.titleAdmin') : t('home.titleUser')}
                    </Title>
                    <Text type="secondary">{t('home.found', { count: profiles.length })}</Text>
                </div>
                <Space>
                    <Button icon={<ExportOutlined />} onClick={handleExportGedcom} size="large">
                        {t('gedcom.export')}
                    </Button>
                    {isAdmin && (
                        <Upload accept=".ged,text/plain" showUploadList={false} beforeUpload={handleImportGedcom}>
                            <Button icon={<ImportOutlined />} size="large">
                                {t('gedcom.import')}
                            </Button>
                        </Upload>
                    )}
                    {isAdmin && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => router.push('/profiles/new')}
                            size="large"
                        >
                            {t('home.newProfile')}
                        </Button>
                    )}
                </Space>
            </div>

            {/* Bannière info pour les utilisateurs non-admin */}
            {!isAdmin && (
                <Alert
                    message={t('home.readOnlyTitle')}
                    description={t('home.readOnlyDesc')}
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Statistiques rapides (admin) */}
            {isAdmin && (
                <>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <Card size="small" style={{ flex: 1 }}>
                            <Statistic
                                title={t('home.statTotal')}
                                value={profiles.length}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                        <Card size="small" style={{ flex: 1 }}>
                            <Statistic
                                title={t('home.statLiving')}
                                value={activeProfiles.length}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                        <Card size="small" style={{ flex: 1 }}>
                            <Statistic
                                title={t('home.statDeceased')}
                                value={deceasedProfiles.length}
                                valueStyle={{ color: '#8c8c8c' }}
                            />
                        </Card>
                        <Card size="small" style={{ flex: 1 }}>
                            <Statistic
                                title={t('home.statNoAccount')}
                                value={orphans.length}
                                valueStyle={{ color: orphans.length > 0 ? '#fa8c16' : '#8c8c8c' }}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </div>
                    {orphans.length > 0 && (
                        <Alert
                            message={t('home.orphansTitle', { count: orphans.length })}
                            description={t('home.orphansDesc')}
                            type="warning"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )}
                </>
            )}

            {/* Barre de recherche */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <Input
                    placeholder={t('home.searchPlaceholder')}
                    prefix={<SearchOutlined />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ flex: 1 }}
                    allowClear
                    onClear={() => {
                        setSearchValue('');
                        setKeyword('');
                    }}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    {t('common.search')}
                </Button>
            </div>

            {/* Table */}
            <Table
                dataSource={profiles}
                columns={columns}
                rowKey="id"
                loading={isFetching}
                locale={{
                    emptyText: keyword
                        ? t('home.emptyNoMatch', { keyword })
                        : t('home.emptyNoProfiles'),
                }}
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
                    showTotal: (total) => t('home.found', { count: total }),
                }}
                bordered={false}
                style={{ background: '#fff', borderRadius: 8 }}
                scroll={{ x: 'max-content' }}
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
