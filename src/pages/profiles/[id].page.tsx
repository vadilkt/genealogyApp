import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Popconfirm, Select, Skeleton, Space, Tag, Tabs, Typography, message } from 'antd';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { AcademicTab } from '@/components/profile/AcademicTab';
import { AlertsTab } from '@/components/profile/AlertsTab';
import { FamilyTab } from '@/components/profile/FamilyTab';
import { InfoTab } from '@/components/profile/InfoTab';
import { ProfessionalTab } from '@/components/profile/ProfessionalTab';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { REDIRECT_DELAY_MS } from '@/consts';
import { useDeleteProfile, useProfile } from '@/domains/profiles/useProfiles';
import { useAssignUser, useUsers } from '@/domains/users/useUsers';

const { Title, Text } = Typography;

const ProfileDetailContent = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { isAdmin, user } = useAuthContext();
    const id = Number(router.query.id);

    const { data: profile, isLoading } = useProfile(id);
    const { mutate: deleteProfile } = useDeleteProfile();
    const { data: users, isLoading: usersLoading } = useUsers();
    const { mutate: assignUser } = useAssignUser();
    const isOwnProfile = profile?.userId === user?.id;
    const [messageApi, contextHolder] = message.useMessage();

    if (isLoading || !id) {
        return (
            <Card>
                <Skeleton active avatar paragraph={{ rows: 6 }} />
            </Card>
        );
    }

    if (!profile) {
        return <Empty description={t('common.notFound')} />;
    }

    const handleDelete = () => {
        deleteProfile(id, {
            onSuccess: () => {
                messageApi.success(t('profile.deleted'));
                setTimeout(() => router.push('/'), REDIRECT_DELAY_MS);
            },
        });
    };

    // Profession : publique. Parcours académique : visible si propriétaire/admin, ou personne décédée.
    const isDeceased = !!profile.dateOfDeath;
    const canSeeAcademic = isAdmin || isOwnProfile || isDeceased;

    const extraTabs = [
        {
            key: 'professionnel',
            label: (
                <span>
                    {t('profile.tabProfessional')}
                    {profile.professionalRecords.length > 0 && (
                        <Tag color="blue" style={{ marginLeft: 6, lineHeight: '16px', padding: '0 5px' }}>
                            {profile.professionalRecords.length}
                        </Tag>
                    )}
                </span>
            ),
            children: <ProfessionalTab profileId={id} isOwnProfile={isOwnProfile} />,
        },
        ...(canSeeAcademic ? [
            {
                key: 'academique',
                label: (
                    <span>
                        {t('profile.tabAcademic')}
                        {profile.academicRecords.length > 0 && (
                            <Tag color="purple" style={{ marginLeft: 6, lineHeight: '16px', padding: '0 5px' }}>
                                {profile.academicRecords.length}
                            </Tag>
                        )}
                    </span>
                ),
                children: <AcademicTab profileId={id} isOwnProfile={isOwnProfile} />,
            },
        ] : []),
        {
            key: 'alertes',
            label: t('profile.tabAlerts'),
            children: <AlertsTab profileId={id} />,
        },
    ];

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
                <Space align="center">
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.push('/')}>
                        {t('common.back')}
                    </Button>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            {profile.firstName} {profile.lastName}
                        </Title>
                        <Space size={8}>
                            <Tag color={profile.gender === 'MALE' ? 'blue' : 'pink'}>
                                {profile.gender === 'MALE' ? t('common.male') : t('common.female')}
                            </Tag>
                            {profile.dateOfDeath ? (
                                <Tag color="default">{t('common.deceased')}</Tag>
                            ) : (
                                <Tag color="green">{t('common.living')}</Tag>
                            )}
                            {profile.age !== null && (
                                <Text type="secondary">{t('common.years', { count: profile.age })}</Text>
                            )}
                        </Space>
                    </div>
                </Space>

                <Space direction="vertical" align="end" size={8}>
                    <Space>
                        <Button icon={<UserOutlined />} onClick={() => router.push(`/profiles/${id}/tree`)}>
                            {t('profile.treeButton')}
                        </Button>
                        {(isAdmin || isOwnProfile) && (
                            <>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => router.push(`/profiles/${id}/edit`)}
                                >
                                    {t('common.edit')}
                                </Button>
                                {isAdmin && (
                                    <Popconfirm
                                        title={t('profile.deleteConfirmTitle')}
                                        description={t('profile.deleteConfirmDesc')}
                                        onConfirm={handleDelete}
                                        okText={t('common.delete')}
                                        cancelText={t('common.cancel')}
                                        okButtonProps={{ danger: true }}
                                    >
                                        <Button danger icon={<DeleteOutlined />}>
                                            {t('common.delete')}
                                        </Button>
                                    </Popconfirm>
                                )}
                            </>
                        )}
                    </Space>
                    {isAdmin && (
                        <Space size={6} align="center">
                            <Text type="secondary" style={{ fontSize: 12 }}>{t('profile.linkedAccount')}</Text>
                            <Select
                                size="small"
                                style={{ width: 200 }}
                                placeholder={t('profile.unassigned')}
                                value={(profile.userId as number | null) ?? undefined}
                                allowClear
                                loading={usersLoading}
                                onChange={(userId: number | undefined) =>
                                    assignUser({ profileId: id, userId: userId ?? null })
                                }
                                options={(users ?? []).map((u) => ({
                                    value: u.id,
                                    label: `${u.username} (${u.role})`,
                                }))}
                            />
                        </Space>
                    )}
                </Space>
            </div>

            {/* Informations */}
            <Card
                title={t('profile.sectionInfo')}
                style={{ borderRadius: 8, marginBottom: 16 }}
                styles={{ header: { fontWeight: 600 } }}
            >
                <InfoTab profileId={id} />
            </Card>

            {/* Filiation & Famille */}
            <Card
                title={t('profile.sectionFamily')}
                style={{ borderRadius: 8, marginBottom: 16 }}
                styles={{ header: { fontWeight: 600 } }}
            >
                <FamilyTab profileId={id} isOwnProfile={isOwnProfile} />
            </Card>

            {/* Parcours professionnel, académique & alertes */}
            <Card style={{ borderRadius: 8 }}>
                <Tabs items={extraTabs} size="large" />
            </Card>
        </div>
    );
};

const ProfileDetailPage: NextPage = () => (
    <ProtectedRoute>
        <ProfileDetailContent />
    </ProtectedRoute>
);

export default ProfileDetailPage;
