import { WarningOutlined } from '@ant-design/icons';
import { Alert, Space, Spin } from 'antd';

import { useProfileWarnings } from '@/domains/profiles/useProfiles';

export const AlertsTab = ({ profileId }: { profileId: number }) => {
    const { data: warnings = [], isLoading } = useProfileWarnings(profileId);

    if (isLoading) return <Spin />;

    if (warnings.length === 0) {
        return (
            <Alert
                message="Aucune alerte"
                description="Les données de ce profil sont cohérentes."
                type="success"
                showIcon
            />
        );
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
                message={`${warnings.length} alerte${warnings.length > 1 ? 's' : ''} détectée${warnings.length > 1 ? 's' : ''}`}
                type="warning"
                showIcon
            />
            {warnings.map((w) => (
                <Alert
                    key={w.code}
                    message={w.code}
                    description={w.message}
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                />
            ))}
        </Space>
    );
};
