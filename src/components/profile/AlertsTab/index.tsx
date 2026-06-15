import { WarningOutlined } from '@ant-design/icons';
import { Alert, Space, Spin } from 'antd';
import { useTranslation } from 'next-i18next';

import { useProfileWarnings } from '@/domains/profiles/useProfiles';

export const AlertsTab = ({ profileId }: { profileId: number }) => {
    const { t } = useTranslation('common');
    const { data: warnings = [], isLoading } = useProfileWarnings(profileId);

    if (isLoading) return <Spin />;

    if (warnings.length === 0) {
        return (
            <Alert
                message={t('alerts.none')}
                description={t('alerts.noneDesc')}
                type="success"
                showIcon
            />
        );
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
                message={t('alerts.detected', { count: warnings.length })}
                type="warning"
                showIcon
            />
            {warnings.map((w) => (
                <Alert
                    key={w.code}
                    message={t(`alerts.codes.${w.code}`, w.code)}
                    description={w.message}
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                />
            ))}
        </Space>
    );
};
