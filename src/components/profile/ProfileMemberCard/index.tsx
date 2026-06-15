import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Popconfirm, Tag } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

interface ProfileMemberCardProps {
    id: number;
    name: string;
    label: string;
    onRemove?: () => void;
    isAdmin: boolean;
}

export const ProfileMemberCard = ({ id, name, label, onRemove, isAdmin }: ProfileMemberCardProps) => {
    const { t } = useTranslation('common');
    const router = useRouter();
    return (
        <Card
            size="small"
            style={{ marginBottom: 8 }}
            actions={
                isAdmin && onRemove
                    ? [
                          <Popconfirm
                              key="remove"
                              title={t('members.removeConfirm', { label: label.toLowerCase() })}
                              onConfirm={onRemove}
                              okText={t('common.remove')}
                              cancelText={t('common.cancel')}
                          >
                              <Button type="text" size="small" danger icon={<DeleteOutlined />}>
                                  {t('common.remove')}
                              </Button>
                          </Popconfirm>,
                      ]
                    : undefined
            }
        >
            <Card.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                    <Button
                        type="link"
                        style={{ padding: 0, height: 'auto' }}
                        onClick={() => router.push(`/profiles/${id}`)}
                    >
                        {name}
                    </Button>
                }
                description={<Tag>{label}</Tag>}
            />
        </Card>
    );
};
