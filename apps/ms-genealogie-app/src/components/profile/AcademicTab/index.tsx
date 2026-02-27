import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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
import { useState } from 'react';

import { useAuthContext } from '@/contexts/AuthContext';
import type { AcademicProfile } from '@/domains/academic/types';
import {
    useAcademicsByProfile,
    useCreateAcademic,
    useDeleteAcademic,
    useUpdateAcademic,
} from '@/domains/academic/useAcademic';
import { formatDate } from '@/utils/formatDate';

const { Text, Title } = Typography;

interface AcademicFormValues {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: dayjs.Dayjs;
    endDate?: dayjs.Dayjs | null;
    grade?: string;
}

export const AcademicTab = ({ profileId, isOwnProfile }: { profileId: number; isOwnProfile: boolean }) => {
    const { isAdmin } = useAuthContext();
    const canEdit = isAdmin || isOwnProfile;
    const [messageApi, contextHolder] = message.useMessage();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AcademicProfile | null>(null);
    const [form] = Form.useForm<AcademicFormValues>();

    const { data: records = [], isLoading } = useAcademicsByProfile(profileId);
    const { mutate: create, isPending: creating } = useCreateAcademic();
    const { mutate: update, isPending: updating } = useUpdateAcademic();
    const { mutate: remove } = useDeleteAcademic();

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: AcademicProfile) => {
        setEditing(record);
        form.setFieldsValue({
            institution: record.institution,
            degree: record.degree,
            fieldOfStudy: record.fieldOfStudy,
            startDate: dayjs(record.startDate),
            endDate: record.endDate ? dayjs(record.endDate) : null,
            grade: record.grade ?? '',
        });
        setModalOpen(true);
    };

    const handleSubmit = (values: AcademicFormValues) => {
        const payload = {
            institution: values.institution,
            degree: values.degree,
            fieldOfStudy: values.fieldOfStudy,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate ? values.endDate.toISOString() : null,
            grade: values.grade ?? null,
        };

        if (editing) {
            update(
                { academicId: editing.id, payload },
                { onSuccess: () => { messageApi.success('Mis à jour'); setModalOpen(false); } },
            );
        } else {
            create(
                { profileId, payload },
                { onSuccess: () => { messageApi.success('Ajouté'); setModalOpen(false); } },
            );
        }
    };

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>
                    {isLoading ? 'Chargement...' : `Parcours académique (${records.length})`}
                </Title>
                {canEdit && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} size="small">
                        Ajouter
                    </Button>
                )}
            </div>

            {records.length === 0 ? (
                <Empty description="Aucun parcours académique enregistré" />
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
                                              Modifier
                                          </Button>,
                                          <Popconfirm
                                              key="delete"
                                              title="Supprimer ce parcours ?"
                                              onConfirm={() =>
                                                  remove(item.id, {
                                                      onSuccess: () => messageApi.success('Supprimé'),
                                                  })
                                              }
                                              okText="Supprimer"
                                              cancelText="Annuler"
                                          >
                                              <Button type="link" danger icon={<DeleteOutlined />}>
                                                  Supprimer
                                              </Button>
                                          </Popconfirm>,
                                      ]
                                    : undefined
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar style={{ background: '#722ed1' }}>🎓</Avatar>}
                                title={
                                    <Space>
                                        <Text strong>{item.degree}</Text>
                                        <Tag color="purple">{item.fieldOfStudy}</Tag>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text>{item.institution}</Text>
                                        <Text type="secondary">
                                            {formatDate(item.startDate)} → {item.endDate ? formatDate(item.endDate) : 'En cours'}
                                        </Text>
                                        {item.grade && <Tag color="gold">Mention : {item.grade}</Tag>}
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}

            <Modal
                title={editing ? 'Modifier le parcours' : 'Ajouter un parcours académique'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="institution" label="Établissement" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="degree" label="Diplôme" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="fieldOfStudy" label="Domaine d'études" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                        <Form.Item name="startDate" label="Début" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="endDate" label="Fin">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="En cours" />
                        </Form.Item>
                    </div>
                    <Form.Item name="grade" label="Mention / Note">
                        <Input placeholder="ex: Très Bien, 16/20..." />
                    </Form.Item>
                    <Space>
                        <Button onClick={() => setModalOpen(false)}>Annuler</Button>
                        <Button type="primary" htmlType="submit" loading={creating || updating}>
                            {editing ? 'Mettre à jour' : 'Ajouter'}
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </div>
    );
};
