import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Empty,
    Form,
    Input,
    Row,
    Select,
    Skeleton,
    Space,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { REDIRECT_DELAY_MS } from '@/consts';
import { usePlaces } from '@/domains/places/usePlaces';
import type { ProfileFormValues, UpdateProfilePayload } from '@/domains/profiles/types';
import { useProfile, useUpdateProfile } from '@/domains/profiles/useProfiles';
import { datePickerProps } from '@/utils/formatDate';

const { Title } = Typography;

const EditProfileContent = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const id = Number(router.query.id);
    const [form] = Form.useForm<ProfileFormValues>();
    const [messageApi, contextHolder] = message.useMessage();

    const { isAdmin, user } = useAuthContext();

    const { data: profile, isLoading } = useProfile(id);
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const { data: places = [] } = usePlaces();

    const birthPrecision = Form.useWatch('birthDatePrecision', form);
    const deathPrecision = Form.useWatch('deathDatePrecision', form);

    const precisionOptions = [
        { value: 'DAY', label: t('form.precisionDay') },
        { value: 'MONTH', label: t('form.precisionMonth') },
        { value: 'YEAR', label: t('form.precisionYear') },
    ];
    const qualifierOptions = [
        { value: 'EXACT', label: t('form.qualifierExact') },
        { value: 'ABOUT', label: t('form.qualifierAbout') },
        { value: 'BEFORE', label: t('form.qualifierBefore') },
        { value: 'AFTER', label: t('form.qualifierAfter') },
    ];

    useEffect(() => {
        if (profile && !isAdmin && profile.userId !== user?.id) {
            router.replace('/');
            return;
        }
        if (profile) {
            form.setFieldsValue({
                firstName: profile.firstName ?? undefined,
                lastName: profile.lastName ?? '',
                gender: profile.gender ?? undefined,
                dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : undefined,
                dateOfDeath: profile.dateOfDeath ? dayjs(profile.dateOfDeath) : null,
                birthDateQualifier: profile.birthDateQualifier ?? 'EXACT',
                birthDatePrecision: profile.birthDatePrecision ?? 'DAY',
                deathDateQualifier: profile.deathDateQualifier ?? 'EXACT',
                deathDatePrecision: profile.deathDatePrecision ?? 'DAY',
                residence: profile.residence ?? undefined,
                birthPlaceId: profile.birthPlace?.id,
                deathPlaceId: profile.deathPlace?.id,
            });
        }
    }, [profile, form]);

    const onFinish = (values: ProfileFormValues) => {
        const payload: UpdateProfilePayload = {
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            dateOfBirth: values.dateOfBirth.toISOString(),
            dateOfDeath: values.dateOfDeath ? values.dateOfDeath.toISOString() : null,
            birthDateQualifier: values.birthDateQualifier,
            birthDatePrecision: values.birthDatePrecision,
            deathDateQualifier: values.deathDateQualifier,
            deathDatePrecision: values.deathDatePrecision,
            residence: values.residence,
            birthPlaceId: values.birthPlaceId ?? null,
            deathPlaceId: values.deathPlaceId ?? null,
        };

        updateProfile(
            { id, payload },
            {
                onSuccess: () => {
                    messageApi.success(t('form.updated'));
                    setTimeout(() => router.push(`/profiles/${id}`), REDIRECT_DELAY_MS);
                },
                onError: () => {
                    messageApi.error(t('form.updateError'));
                },
            },
        );
    };

    const placeLabel = (p: (typeof places)[number]) =>
        `${p.city}, ${p.country}${p.region ? ` (${p.region})` : ''}`;
    const placeOptions = places.map((p) => ({ value: p.id, label: placeLabel(p) }));
    const residenceOptions = places.map((p) => ({ value: placeLabel(p), label: placeLabel(p) }));
    // Keep an existing free-text residence selectable even if it isn't a known place.
    if (profile?.residence && !residenceOptions.some((o) => o.value === profile.residence)) {
        residenceOptions.unshift({ value: profile.residence, label: profile.residence });
    }

    if (isLoading || !id) {
        return (
            <Card style={{ maxWidth: 700 }}>
                <Skeleton active paragraph={{ rows: 10 }} />
            </Card>
        );
    }

    if (!profile) {
        return <Empty description={t('common.notFound')} />;
    }

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push(`/profiles/${id}`)}
                >
                    {t('form.backToProfile')}
                </Button>
                <Title level={3} style={{ margin: 0 }}>
                    {t('form.editProfile', { name: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() })}
                </Title>
            </div>

            <Card style={{ maxWidth: 700, borderRadius: 8 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    size="middle"
                    requiredMark="optional"
                >
                    <Divider orientation="left">{t('form.sectionPersonal')}</Divider>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="firstName"
                                label={t('form.firstName')}
                                rules={[{ required: true, message: t('form.firstNameRequired') }]}
                            >
                                <Input placeholder={t('form.firstNamePlaceholder')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="lastName" label={t('form.lastName')}>
                                <Input placeholder={t('form.lastNamePlaceholder')} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="gender"
                                label={t('form.gender')}
                                rules={[{ required: true, message: t('form.genderRequired') }]}
                            >
                                <Select placeholder={t('form.selectGender')}>
                                    <Select.Option value="MALE">{t('common.male')}</Select.Option>
                                    <Select.Option value="FEMALE">{t('common.female')}</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="residence"
                                label={t('form.residence')}
                                rules={[{ required: true, message: t('form.residenceRequired') }]}
                            >
                                <Select
                                    placeholder={t('form.searchPlace')}
                                    options={residenceOptions}
                                    showSearch
                                    allowClear
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="dateOfBirth"
                                label={t('form.birthDate')}
                                rules={[{ required: true, message: t('form.birthDateRequired') }]}
                                style={{ marginBottom: 8 }}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    {...datePickerProps(birthPrecision)}
                                    placeholder={t('form.birthDatePlaceholder')}
                                    disabledDate={(d) => d.isAfter(new Date())}
                                />
                            </Form.Item>
                            <Space size={8}>
                                <Form.Item name="birthDatePrecision" label={t('form.precision')} style={{ marginBottom: 0 }}>
                                    <Select options={precisionOptions} style={{ width: 130 }} />
                                </Form.Item>
                                <Form.Item name="birthDateQualifier" label={t('form.certainty')} style={{ marginBottom: 0 }}>
                                    <Select options={qualifierOptions} style={{ width: 130 }} />
                                </Form.Item>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="dateOfDeath"
                                label={t('form.deathDate')}
                                dependencies={['dateOfBirth']}
                                style={{ marginBottom: 8 }}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const birth = getFieldValue('dateOfBirth');
                                            if (!value || !birth || value.isAfter(birth)) return Promise.resolve();
                                            return Promise.reject(new Error(t('form.deathAfterBirth')));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    {...datePickerProps(deathPrecision)}
                                    placeholder={t('form.deathDatePlaceholder')}
                                    disabledDate={(d) => {
                                        const birth = form.getFieldValue('dateOfBirth');
                                        return birth ? d.isBefore(birth) : false;
                                    }}
                                />
                            </Form.Item>
                            <Space size={8}>
                                <Form.Item name="deathDatePrecision" label={t('form.precision')} style={{ marginBottom: 0 }}>
                                    <Select options={precisionOptions} style={{ width: 130 }} />
                                </Form.Item>
                                <Form.Item name="deathDateQualifier" label={t('form.certainty')} style={{ marginBottom: 0 }}>
                                    <Select options={qualifierOptions} style={{ width: 130 }} />
                                </Form.Item>
                            </Space>
                        </Col>
                    </Row>

                    <Divider orientation="left">{t('form.sectionLocation')}</Divider>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="birthPlaceId" label={t('form.birthPlace')}>
                                <Select
                                    placeholder={t('form.searchPlace')}
                                    options={placeOptions}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="deathPlaceId" label={t('form.deathPlace')}>
                                <Select
                                    placeholder={t('form.searchPlace')}
                                    options={placeOptions}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Space>
                        <Button onClick={() => router.push(`/profiles/${id}`)}>{t('common.cancel')}</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={isPending}
                        >
                            {t('form.saveChanges')}
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
};

const EditProfilePage: NextPage = () => (
    <ProtectedRoute>
        <EditProfileContent />
    </ProtectedRoute>
);

export default EditProfilePage;
