import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    DatePicker,
    Empty,
    Form,
    Input,
    List,
    Modal,
    Popconfirm,
    Space,
    Tag,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { useAuthContext } from '@/contexts/AuthContext';
import type { ProfessionalProfile } from '@/domains/professional/types';
import {
    useCreateProfessional,
    useDeleteProfessional,
    useProfessionalsByProfile,
    useUpdateProfessional,
} from '@/domains/professional/useProfessional';
import { formatDate } from '@/utils/formatDate';

const { Text, Title } = Typography;

interface ProfessionalFormValues {
    profession: string;
    entreprise: string;
    ville: string;
    dateDebut: dayjs.Dayjs;
    dateFin?: dayjs.Dayjs | null;
    description?: string;
}

export const ProfessionalTab = ({ profileId, isOwnProfile }: { profileId: number; isOwnProfile: boolean }) => {
    const { t } = useTranslation('common');
    const { isAdmin } = useAuthContext();
    const canEdit = isAdmin || isOwnProfile;
    const [messageApi, contextHolder] = message.useMessage();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ProfessionalProfile | null>(null);
    const [form] = Form.useForm<ProfessionalFormValues>();

    const { data: records = [], isLoading } = useProfessionalsByProfile(profileId);
    const { mutate: create, isPending: creating } = useCreateProfessional();
    const { mutate: update, isPending: updating } = useUpdateProfessional();
    const { mutate: remove } = useDeleteProfessional();

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: ProfessionalProfile) => {
        setEditing(record);
        form.setFieldsValue({
            profession: record.profession,
            entreprise: record.entreprise,
            ville: record.ville,
            dateDebut: dayjs(record.dateDebut),
            dateFin: record.dateFin ? dayjs(record.dateFin) : null,
            description: record.description ?? '',
        });
        setModalOpen(true);
    };

    const handleSubmit = (values: ProfessionalFormValues) => {
        const payload = {
            profession: values.profession,
            entreprise: values.entreprise,
            ville: values.ville,
            dateDebut: values.dateDebut.toISOString(),
            dateFin: values.dateFin ? values.dateFin.toISOString() : null,
            description: values.description ?? null,
        };

        if (editing) {
            update(
                { professionalId: editing.id, payload },
                { onSuccess: () => { messageApi.success(t('common.updated')); setModalOpen(false); } },
            );
        } else {
            create(
                { profileId, payload },
                { onSuccess: () => { messageApi.success(t('common.added')); setModalOpen(false); } },
            );
        }
    };

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>
                    {isLoading ? t('common.loading') : t('professional.title', { count: records.length })}
                </Title>
                {canEdit && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} size="small">
                        {t('common.add')}
                    </Button>
                )}
            </div>

            {records.length === 0 ? (
                <Empty description={t('professional.noRecord')} />
            ) : (
                <List
                    dataSource={records}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            actions={
                                canEdit
                                    ? [
                                          <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => openEdit(item)}>
                                              {t('common.edit')}
                                          </Button>,
                                          <Popconfirm
                                              key="delete"
                                              title={t('professional.deleteConfirm')}
                                              onConfirm={() =>
                                                  remove(item.id, {
                                                      onSuccess: () => messageApi.success(t('common.deleted')),
                                                  })
                                              }
                                              okText={t('common.delete')}
                                              cancelText={t('common.cancel')}
                                          >
                                              <Button type="link" danger icon={<DeleteOutlined />}>
                                                  {t('common.delete')}
                                              </Button>
                                          </Popconfirm>,
                                      ]
                                    : undefined
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={
                                    <Space>
                                        <Text strong>{item.profession}</Text>
                                        <Tag color="blue">{item.entreprise}</Tag>
                                        <Text type="secondary">{item.ville}</Text>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary">
                                            {formatDate(item.dateDebut)} → {item.dateFin ? formatDate(item.dateFin) : t('common.present')}
                                        </Text>
                                        {item.description && <Text>{item.description}</Text>}
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}

            <Modal
                title={editing ? t('professional.editTitle') : t('professional.addTitle')}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="profession" label={t('professional.position')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="entreprise" label={t('professional.company')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="ville" label={t('professional.city')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                        <Form.Item name="dateDebut" label={t('professional.startDate')} rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="dateFin" label={t('professional.endDate')}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder={t('common.ongoing')} />
                        </Form.Item>
                    </div>
                    <Form.Item name="description" label={t('professional.description')}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Space>
                        <Button onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
                        <Button type="primary" htmlType="submit" loading={creating || updating}>
                            {editing ? t('common.update') : t('common.add')}
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </div>
    );
};
