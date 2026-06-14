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
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Place , CreatePlacePayload } from '@/domains/places/types';
import { usePlaces, useCreatePlace } from '@/domains/places/usePlaces';

const { Title } = Typography;

const PlacesContent = () => {
    const { t } = useTranslation('common');
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
            title: t('adminPlaces.colId'),
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: t('adminPlaces.colCity'),
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
            title: t('adminPlaces.colCountry'),
            dataIndex: 'country',
            key: 'country',
            render: (country: string) => <Tag>{country}</Tag>,
            sorter: (a, b) => a.country.localeCompare(b.country),
        },
        {
            title: t('adminPlaces.colRegion'),
            dataIndex: 'region',
            key: 'region',
            render: (region: string | null) => region || <span style={{ color: '#bbb' }}>—</span>,
        },
    ];

    const onFinish = (values: CreatePlacePayload) => {
        createPlace(values, {
            onSuccess: () => {
                messageApi.success(t('adminPlaces.created'));
                setModalOpen(false);
                form.resetFields();
            },
            onError: () => {
                messageApi.error(t('adminPlaces.createError'));
            },
        });
    };

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ marginBottom: 4 }}>{t('adminPlaces.title')}</Title>
                    <Typography.Text type="secondary">
                        {t('adminPlaces.count', { count: places.length })}
                    </Typography.Text>
                </div>
                <Tooltip title={t('adminPlaces.newPlaceTooltip')}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalOpen(true)}
                    >
                        {t('adminPlaces.newPlace')}
                    </Button>
                </Tooltip>
            </div>

            <Table
                dataSource={places}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                locale={{ emptyText: t('adminPlaces.empty') }}
                pagination={{
                    pageSize: 20,
                    showTotal: (total) => t('adminPlaces.total', { count: total }),
                }}
                style={{ borderRadius: 8 }}
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={t('adminPlaces.addTitle')}
                open={modalOpen}
                onCancel={handleCloseModal}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
                    <Form.Item
                        name="city"
                        label={t('adminPlaces.city')}
                        rules={[{ required: true, message: t('adminPlaces.cityRequired') }]}
                    >
                        <Input placeholder={t('adminPlaces.cityPlaceholder')} />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label={t('adminPlaces.country')}
                        rules={[{ required: true, message: t('adminPlaces.countryRequired') }]}
                    >
                        <Input placeholder={t('adminPlaces.countryPlaceholder')} />
                    </Form.Item>
                    <Form.Item name="region" label={t('adminPlaces.region')}>
                        <Input placeholder={t('adminPlaces.regionPlaceholder')} />
                    </Form.Item>
                    <Space>
                        <Button onClick={handleCloseModal}>{t('common.cancel')}</Button>
                        <Button type="primary" htmlType="submit" loading={isPending}>
                            {t('adminPlaces.create')}
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
