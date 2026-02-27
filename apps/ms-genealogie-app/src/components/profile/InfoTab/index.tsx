import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { Descriptions, Empty, Space, Spin, Tag } from 'antd';

import { useProfile } from '@/domains/profiles/useProfiles';
import { formatDate } from '@/utils/formatDate';

export const InfoTab = ({ profileId }: { profileId: number }) => {
    const { data: profile, isLoading } = useProfile(profileId);

    if (isLoading) return <Spin />;
    if (!profile) return <Empty description="Profil introuvable" />;

    return (
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
            <Descriptions.Item label="Prénom">{profile.firstName}</Descriptions.Item>
            <Descriptions.Item label="Nom">{profile.lastName || '—'}</Descriptions.Item>
            <Descriptions.Item label="Genre">
                {profile.gender === 'MALE' ? (
                    <Space>
                        <ManOutlined />
                        <Tag color="blue">Homme</Tag>
                    </Space>
                ) : (
                    <Space>
                        <WomanOutlined />
                        <Tag color="pink">Femme</Tag>
                    </Space>
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Résidence">{profile.residence}</Descriptions.Item>
            <Descriptions.Item label="Date de naissance">{formatDate(profile.dateOfBirth)}</Descriptions.Item>
            <Descriptions.Item label="Date de décès">
                {profile.dateOfDeath ? (
                    <Tag color="default">{formatDate(profile.dateOfDeath)}</Tag>
                ) : (
                    <Tag color="green">Vivant(e)</Tag>
                )}
            </Descriptions.Item>
            {profile.age !== null && (
                <Descriptions.Item label="Âge">{profile.age} ans</Descriptions.Item>
            )}
            <Descriptions.Item label="Lieu de naissance">
                {profile.birthPlace
                    ? `${profile.birthPlace.city}, ${profile.birthPlace.country}`
                    : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Lieu de décès">
                {profile.deathPlace
                    ? `${profile.deathPlace.city}, ${profile.deathPlace.country}`
                    : '—'}
            </Descriptions.Item>
        </Descriptions>
    );
};
