import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Popconfirm, Select, Space, Spin, Tag, Tabs, Typography, message } from 'antd';
import type { NextPage } from 'next';
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
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return <Empty description="Profil introuvable" />;
    }

    const handleDelete = () => {
        deleteProfile(id, {
            onSuccess: () => {
                messageApi.success('Profil supprimé');
                setTimeout(() => router.push('/'), REDIRECT_DELAY_MS);
            },
        });
    };

    const extraTabs = [
        ...(isAdmin || isOwnProfile ? [
            {
                key: 'professionnel',
                label: (
                    <span>
                        Professionnel
                        {profile.professionalRecords.length > 0 && (
                            <Tag color="blue" style={{ marginLeft: 6, lineHeight: '16px', padding: '0 5px' }}>
                                {profile.professionalRecords.length}
                            </Tag>
                        )}
                    </span>
                ),
                children: <ProfessionalTab profileId={id} isOwnProfile={isOwnProfile} />,
            },
            {
                key: 'academique',
                label: (
                    <span>
                        Académique
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
            label: 'Alertes',
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
                        Retour
                    </Button>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            {profile.firstName} {profile.lastName}
                        </Title>
                        <Space size={8}>
                            <Tag color={profile.gender === 'MALE' ? 'blue' : 'pink'}>
                                {profile.gender === 'MALE' ? 'Homme' : 'Femme'}
                            </Tag>
                            {profile.dateOfDeath ? (
                                <Tag color="default">Décédé(e)</Tag>
                            ) : (
                                <Tag color="green">Vivant(e)</Tag>
                            )}
                            {profile.age !== null && (
                                <Text type="secondary">{profile.age} ans</Text>
                            )}
                        </Space>
                    </div>
                </Space>

                <Space direction="vertical" align="end" size={8}>
                    <Space>
                        <Button icon={<UserOutlined />} onClick={() => router.push(`/profiles/${id}/tree`)}>
                            Arbre
                        </Button>
                        {(isAdmin || isOwnProfile) && (
                            <>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => router.push(`/profiles/${id}/edit`)}
                                >
                                    Modifier
                                </Button>
                                {isAdmin && (
                                    <Popconfirm
                                        title="Supprimer ce profil ?"
                                        description="Cette action est définitive et irréversible."
                                        onConfirm={handleDelete}
                                        okText="Supprimer"
                                        cancelText="Annuler"
                                        okButtonProps={{ danger: true }}
                                    >
                                        <Button danger icon={<DeleteOutlined />}>
                                            Supprimer
                                        </Button>
                                    </Popconfirm>
                                )}
                            </>
                        )}
                    </Space>
                    {isAdmin && (
                        <Space size={6} align="center">
                            <Text type="secondary" style={{ fontSize: 12 }}>Compte lié :</Text>
                            <Select
                                size="small"
                                style={{ width: 200 }}
                                placeholder="Non assigné"
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
                title="Informations"
                style={{ borderRadius: 8, marginBottom: 16 }}
                styles={{ header: { fontWeight: 600 } }}
            >
                <InfoTab profileId={id} />
            </Card>

            {/* Filiation & Famille */}
            <Card
                title="Filiation & Famille"
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
