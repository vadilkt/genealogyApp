import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Col,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Typography,
    Space,
    Card,
    Divider,
    Row,
    message,
} from 'antd';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { REDIRECT_DELAY_MS } from '@/consts';
import { usePlaces } from '@/domains/places/usePlaces';
import type { CreateProfilePayload, ProfileFormValues } from '@/domains/profiles/types';
import { useCreateProfile, useMyProfile } from '@/domains/profiles/useProfiles';
import { datePickerProps } from '@/utils/formatDate';

const { Title } = Typography;

const NewProfileContent = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [form] = Form.useForm<ProfileFormValues>();
    const [messageApi, contextHolder] = message.useMessage();
    const { isAdmin } = useAuthContext();

    const { mutate: createProfile, isPending } = useCreateProfile();
    const { data: places = [] } = usePlaces();
    const { data: myProfile, isLoading: loadingMyProfile } = useMyProfile();

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

    // Non-admin user who already has a profile → redirect to it
    if (!isAdmin && !loadingMyProfile && myProfile) {
        router.replace(`/profiles/${myProfile.id}`);
        return null;
    }

    const onFinish = (values: ProfileFormValues) => {
        const payload: CreateProfilePayload = {
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

        createProfile(payload, {
            onSuccess: (created) => {
                messageApi.success(t('form.created'));
                setTimeout(() => router.push(`/profiles/${created.id}`), REDIRECT_DELAY_MS);
            },
            onError: () => {
                messageApi.error(t('form.createError'));
            },
        });
    };

    const placeLabel = (p: (typeof places)[number]) =>
        `${p.city}, ${p.country}${p.region ? ` (${p.region})` : ''}`;
    const placeOptions = places.map((p) => ({ value: p.id, label: placeLabel(p) }));
    const residenceOptions = places.map((p) => ({ value: placeLabel(p), label: placeLabel(p) }));

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                >
                    {t('common.back')}
                </Button>
                <Title level={3} style={{ margin: 0 }}>
                    {t('form.newProfile')}
                </Title>
            </div>

            <Card style={{ maxWidth: 700, borderRadius: 8 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    size="middle"
                    requiredMark="optional"
                    initialValues={{
                        birthDateQualifier: 'EXACT',
                        birthDatePrecision: 'DAY',
                        deathDateQualifier: 'EXACT',
                        deathDatePrecision: 'DAY',
                    }}
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
                        <Button onClick={() => router.back()}>{t('common.cancel')}</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={isPending}
                        >
                            {t('form.create')}
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
};

const NewProfilePage: NextPage = () => (
    <ProtectedRoute>
        <NewProfileContent />
    </ProtectedRoute>
);

export default NewProfilePage;
