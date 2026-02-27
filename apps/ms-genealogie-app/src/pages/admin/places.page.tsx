import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {
    Typography,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    message,
    Tag,
    Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { NextPage } from 'next';
import { useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Place , CreatePlacePayload } from '@/domains/places/types';
import { usePlaces, useCreatePlace } from '@/domains/places/usePlaces';

const { Title } = Typography;

const PlacesContent = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm<CreatePlacePayload>();

    const { data: places = [], isLoading } = usePlaces();
    const { mutate: createPlace, isPending } = useCreatePlace();

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
    };

    const columns: ColumnsType<Place> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Ville',
            dataIndex: 'city',
            key: 'city',
            render: (city: string) => (
                <Space>
                    <EnvironmentOutlined />
                    {city}
                </Space>
            ),
            sorter: (a, b) => a.city.localeCompare(b.city),
        },
        {
            title: 'Pays',
            dataIndex: 'country',
            key: 'country',
            render: (country: string) => <Tag>{country}</Tag>,
            sorter: (a, b) => a.country.localeCompare(b.country),
        },
        {
            title: 'Région',
            dataIndex: 'region',
            key: 'region',
            render: (region: string | null) => region || <span style={{ color: '#bbb' }}>—</span>,
        },
    ];

    const onFinish = (values: CreatePlacePayload) => {
        createPlace(values, {
            onSuccess: () => {
                messageApi.success('Lieu créé avec succès !');
                setModalOpen(false);
                form.resetFields();
            },
            onError: () => {
                messageApi.error('Erreur lors de la création du lieu.');
            },
        });
    };

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ marginBottom: 4 }}>Gestion des Lieux</Title>
                    <Typography.Text type="secondary">
                        {places.length} lieu{places.length > 1 ? 'x' : ''} enregistré{places.length > 1 ? 's' : ''}
                    </Typography.Text>
                </div>
                <Tooltip title="Ajouter un nouveau lieu">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalOpen(true)}
                    >
                        Nouveau lieu
                    </Button>
                </Tooltip>
            </div>

            <Table
                dataSource={places}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    pageSize: 20,
                    showTotal: (total) => `${total} lieu${total > 1 ? 'x' : ''}`,
                }}
                style={{ borderRadius: 8 }}
            />

            <Modal
                title="Ajouter un lieu"
                open={modalOpen}
                onCancel={handleCloseModal}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
                    <Form.Item
                        name="city"
                        label="Ville"
                        rules={[{ required: true, message: 'La ville est requise' }]}
                    >
                        <Input placeholder="ex : Paris" />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Pays"
                        rules={[{ required: true, message: 'Le pays est requis' }]}
                    >
                        <Input placeholder="ex : France" />
                    </Form.Item>
                    <Form.Item name="region" label="Région (optionnel)">
                        <Input placeholder="ex : Île-de-France" />
                    </Form.Item>
                    <Space>
                        <Button onClick={handleCloseModal}>Annuler</Button>
                        <Button type="primary" htmlType="submit" loading={isPending}>
                            Créer le lieu
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </div>
    );
};

const PlacesPage: NextPage = () => (
    <ProtectedRoute adminOnly>
        <PlacesContent />
    </ProtectedRoute>
);

export default PlacesPage;
