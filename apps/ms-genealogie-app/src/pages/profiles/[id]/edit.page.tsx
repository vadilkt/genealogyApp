import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    DatePicker,
    Divider,
    Empty,
    Form,
    Input,
    Select,
    Space,
    Spin,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { REDIRECT_DELAY_MS } from '@/consts';
import { usePlaces } from '@/domains/places/usePlaces';
import type { ProfileFormValues, UpdateProfilePayload } from '@/domains/profiles/types';
import { useProfile, useUpdateProfile } from '@/domains/profiles/useProfiles';

const { Title } = Typography;

const EditProfileContent = () => {
    const router = useRouter();
    const id = Number(router.query.id);
    const [form] = Form.useForm<ProfileFormValues>();
    const [messageApi, contextHolder] = message.useMessage();

    const { isAdmin, user } = useAuthContext();

    const { data: profile, isLoading } = useProfile(id);
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const { data: places = [] } = usePlaces();

    useEffect(() => {
        if (profile && !isAdmin && profile.userId !== user?.id) {
            router.replace('/');
            return;
        }
        if (profile) {
            form.setFieldsValue({
                firstName: profile.firstName,
                lastName: profile.lastName ?? '',
                gender: profile.gender,
                dateOfBirth: dayjs(profile.dateOfBirth),
                dateOfDeath: profile.dateOfDeath ? dayjs(profile.dateOfDeath) : null,
                residence: profile.residence,
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
            residence: values.residence,
            birthPlaceId: values.birthPlaceId ?? null,
            deathPlaceId: values.deathPlaceId ?? null,
        };

        updateProfile(
            { id, payload },
            {
                onSuccess: () => {
                    messageApi.success('Profil mis à jour !');
                    setTimeout(() => router.push(`/profiles/${id}`), REDIRECT_DELAY_MS);
                },
                onError: () => {
                    messageApi.error('Erreur lors de la mise à jour.');
                },
            },
        );
    };

    const placeOptions = places.map((p) => ({
        value: p.id,
        label: `${p.city}, ${p.country}${p.region ? ` (${p.region})` : ''}`,
    }));

    if (isLoading || !id) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return <Empty description="Profil introuvable" />;
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
                    Retour au profil
                </Button>
                <Title level={3} style={{ margin: 0 }}>
                    Modifier : {profile.firstName} {profile.lastName}
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
                    <Divider orientation="left">Informations personnelles</Divider>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item
                            name="firstName"
                            label="Prénom"
                            rules={[{ required: true, message: 'Le prénom est requis' }]}
                        >
                            <Input placeholder="Prénom" />
                        </Form.Item>

                        <Form.Item name="lastName" label="Nom de famille">
                            <Input placeholder="Nom de famille" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item
                            name="gender"
                            label="Genre"
                            rules={[{ required: true, message: 'Le genre est requis' }]}
                        >
                            <Select placeholder="Sélectionner">
                                <Select.Option value="MALE">Homme</Select.Option>
                                <Select.Option value="FEMALE">Femme</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="residence"
                            label="Résidence"
                            rules={[{ required: true, message: 'La résidence est requise' }]}
                        >
                            <Input placeholder="Ville de résidence" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item
                            name="dateOfBirth"
                            label="Date de naissance"
                            rules={[{ required: true, message: 'La date de naissance est requise' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="jj/mm/aaaa"
                            />
                        </Form.Item>

                        <Form.Item name="dateOfDeath" label="Date de décès">
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="jj/mm/aaaa (optionnel)"
                            />
                        </Form.Item>
                    </div>

                    <Divider orientation="left">Localisation</Divider>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item name="birthPlaceId" label="Lieu de naissance">
                            <Select
                                placeholder="Sélectionner un lieu"
                                options={placeOptions}
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>

                        <Form.Item name="deathPlaceId" label="Lieu de décès">
                            <Select
                                placeholder="Sélectionner un lieu"
                                options={placeOptions}
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </div>

                    <Divider />

                    <Space>
                        <Button onClick={() => router.push(`/profiles/${id}`)}>Annuler</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={isPending}
                        >
                            Enregistrer les modifications
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
