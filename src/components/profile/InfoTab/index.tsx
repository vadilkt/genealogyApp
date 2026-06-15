import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { Descriptions, Empty, Space, Spin, Tag } from 'antd';
import { useTranslation } from 'next-i18next';

import { useProfile } from '@/domains/profiles/useProfiles';
import { formatGenealogicalDate } from '@/utils/formatDate';

export const InfoTab = ({ profileId }: { profileId: number }) => {
    const { t } = useTranslation('common');
    const { data: profile, isLoading } = useProfile(profileId);

    if (isLoading) return <Spin />;
    if (!profile) return <Empty description={t('common.notFound')} />;

    return (
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
            <Descriptions.Item label={t('info.firstName')}>{profile.firstName}</Descriptions.Item>
            <Descriptions.Item label={t('info.lastName')}>{profile.lastName || '—'}</Descriptions.Item>
            <Descriptions.Item label={t('info.gender')}>
                {profile.gender === 'MALE' ? (
                    <Space>
                        <ManOutlined />
                        <Tag color="blue">{t('common.male')}</Tag>
                    </Space>
                ) : (
                    <Space>
                        <WomanOutlined />
                        <Tag color="pink">{t('common.female')}</Tag>
                    </Space>
                )}
            </Descriptions.Item>
            <Descriptions.Item label={t('info.residence')}>{profile.residence}</Descriptions.Item>
            <Descriptions.Item label={t('info.birthDate')}>
                {formatGenealogicalDate(
                    profile.dateOfBirth,
                    profile.birthDateQualifier,
                    profile.birthDatePrecision,
                )}
            </Descriptions.Item>
            <Descriptions.Item label={t('info.deathDate')}>
                {profile.dateOfDeath ? (
                    <Tag color="default">
                        {formatGenealogicalDate(
                            profile.dateOfDeath,
                            profile.deathDateQualifier,
                            profile.deathDatePrecision,
                        )}
                    </Tag>
                ) : (
                    <Tag color="green">{t('common.living')}</Tag>
                )}
            </Descriptions.Item>
            {profile.age !== null && (
                <Descriptions.Item label={t('info.age')}>{t('common.years', { count: profile.age })}</Descriptions.Item>
            )}
            <Descriptions.Item label={t('info.birthPlace')}>
                {profile.birthPlace
                    ? `${profile.birthPlace.city}, ${profile.birthPlace.country}`
                    : '—'}
            </Descriptions.Item>
            <Descriptions.Item label={t('info.deathPlace')}>
                {profile.deathPlace
                    ? `${profile.deathPlace.city}, ${profile.deathPlace.country}`
                    : '—'}
            </Descriptions.Item>
        </Descriptions>
    );
};
