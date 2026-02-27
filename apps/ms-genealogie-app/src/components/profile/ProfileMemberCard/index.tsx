import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Popconfirm, Tag } from 'antd';
import { useRouter } from 'next/router';

interface ProfileMemberCardProps {
    id: number;
    name: string;
    label: string;
    onRemove?: () => void;
    isAdmin: boolean;
}

export const ProfileMemberCard = ({ id, name, label, onRemove, isAdmin }: ProfileMemberCardProps) => {
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
                              title={`Retirer ce ${label.toLowerCase()} ?`}
                              onConfirm={onRemove}
                              okText="Retirer"
                              cancelText="Annuler"
                          >
                              <Button type="text" size="small" danger icon={<DeleteOutlined />}>
                                  Retirer
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
