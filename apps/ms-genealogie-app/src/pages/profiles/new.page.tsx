import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Typography,
    Space,
    Card,
    Divider,
    message,
} from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import { REDIRECT_DELAY_MS } from '@/consts';
import { usePlaces } from '@/domains/places/usePlaces';
import type { CreateProfilePayload, ProfileFormValues } from '@/domains/profiles/types';
import { useCreateProfile, useMyProfile } from '@/domains/profiles/useProfiles';

const { Title } = Typography;

const NewProfileContent = () => {
    const router = useRouter();
    const [form] = Form.useForm<ProfileFormValues>();
    const [messageApi, contextHolder] = message.useMessage();
    const { isAdmin } = useAuthContext();

    const { mutate: createProfile, isPending } = useCreateProfile();
    const { data: places = [] } = usePlaces();
    const { data: myProfile, isLoading: loadingMyProfile } = useMyProfile();

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
            residence: values.residence,
            birthPlaceId: values.birthPlaceId ?? null,
            deathPlaceId: values.deathPlaceId ?? null,
        };

        createProfile(payload, {
            onSuccess: (created) => {
                messageApi.success('Profil créé avec succès !');
                setTimeout(() => router.push(`/profiles/${created.id}`), REDIRECT_DELAY_MS);
            },
            onError: () => {
                messageApi.error('Erreur lors de la création du profil.');
            },
        });
    };

    const placeOptions = places.map((p) => ({
        value: p.id,
        label: `${p.city}, ${p.country}${p.region ? ` (${p.region})` : ''}`,
    }));

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                >
                    Retour
                </Button>
                <Title level={3} style={{ margin: 0 }}>
                    Nouveau profil
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

                        <Form.Item
                            name="lastName"
                            label="Nom de famille"
                        >
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
                        <Button onClick={() => router.back()}>Annuler</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={isPending}
                        >
                            Créer le profil
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
