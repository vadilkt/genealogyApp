import { DeleteOutlined, HeartOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Empty,
    Popconfirm,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    message,
} from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ProfileMemberCard } from '@/components/profile/ProfileMemberCard';
import { ProfileSelect } from '@/components/ProfileSelect';
import { useAuthContext } from '@/contexts/AuthContext';
import {
    useAddMarriage,
    useFamily,
    useRemoveFather,
    useRemoveMarriage,
    useRemoveMother,
    useSetFather,
    useSetMother,
} from '@/domains/family/useFamily';
import { formatDate } from '@/utils/formatDate';

const { Title, Text } = Typography;

export const FamilyTab = ({ profileId, isOwnProfile = false }: { profileId: number; isOwnProfile?: boolean }) => {
    const { isAdmin } = useAuthContext();
    const canEdit = isAdmin || isOwnProfile;
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();

    const { data: family, isLoading, refetch } = useFamily(profileId);
    const { mutate: setFather } = useSetFather();
    const { mutate: setMother } = useSetMother();
    const { mutate: removeFather } = useRemoveFather();
    const { mutate: removeMother } = useRemoveMother();
    const { mutate: addMarriage } = useAddMarriage();
    const { mutate: removeMarriage } = useRemoveMarriage();

    const [fatherId, setFatherId] = useState<number | undefined>();
    const [motherId, setMotherId] = useState<number | undefined>();
    const [spouseId, setSpouseId] = useState<number | undefined>();
    const [marriageDate, setMarriageDate] = useState<dayjs.Dayjs | null>(null);

    const handleSetFather = () => {
        if (!fatherId) return;
        setFather(
            { profileId, payload: { parentProfileId: fatherId } },
            { onSuccess: () => { messageApi.success('Père défini'); refetch(); setFatherId(undefined); } },
        );
    };

    const handleSetMother = () => {
        if (!motherId) return;
        setMother(
            { profileId, payload: { parentProfileId: motherId } },
            { onSuccess: () => { messageApi.success('Mère définie'); refetch(); setMotherId(undefined); } },
        );
    };

    const handleAddMarriage = () => {
        if (!spouseId) return;
        addMarriage(
            {
                profileId,
                payload: {
                    spouseProfileId: spouseId,
                    marriageDate: marriageDate ? marriageDate.toISOString() : null,
                },
            },
            {
                onSuccess: () => {
                    messageApi.success('Mariage enregistré');
                    refetch();
                    setSpouseId(undefined);
                    setMarriageDate(null);
                },
            },
        );
    };

    if (isLoading) return <Spin />;
    if (!family) return <Empty />;

    return (
        <div>
            {contextHolder}
            <Row gutter={24}>
                {/* Père */}
                <Col xs={24} md={12}>
                    <Title level={5} style={{ marginBottom: 12 }}>
                        <HomeOutlined /> Père
                    </Title>
                    {family.father ? (
                        <ProfileMemberCard
                            id={family.father.id}
                            name={`${family.father.firstName} ${family.father.lastName}`}
                            label="Père"
                            isAdmin={canEdit}
                            onRemove={() =>
                                removeFather(profileId, {
                                    onSuccess: () => { messageApi.success('Père retiré'); refetch(); },
                                })
                            }
                        />
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Aucun père enregistré" />
                    )}
                    {canEdit && !family.father && (
                        <Space style={{ marginTop: 8 }}>
                            <ProfileSelect
                                value={fatherId}
                                onChange={setFatherId}
                                placeholder="Choisir le père..."
                                excludeId={profileId}
                            />
                            <Button type="primary" size="small" onClick={handleSetFather} disabled={!fatherId}>
                                Définir
                            </Button>
                        </Space>
                    )}
                </Col>

                {/* Mère */}
                <Col xs={24} md={12}>
                    <Title level={5} style={{ marginBottom: 12 }}>
                        <HomeOutlined /> Mère
                    </Title>
                    {family.mother ? (
                        <ProfileMemberCard
                            id={family.mother.id}
                            name={`${family.mother.firstName} ${family.mother.lastName}`}
                            label="Mère"
                            isAdmin={canEdit}
                            onRemove={() =>
                                removeMother(profileId, {
                                    onSuccess: () => { messageApi.success('Mère retirée'); refetch(); },
                                })
                            }
                        />
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Aucune mère enregistrée" />
                    )}
                    {canEdit && !family.mother && (
                        <Space style={{ marginTop: 8 }}>
                            <ProfileSelect
                                value={motherId}
                                onChange={setMotherId}
                                placeholder="Choisir la mère..."
                                excludeId={profileId}
                            />
                            <Button type="primary" size="small" onClick={handleSetMother} disabled={!motherId}>
                                Définir
                            </Button>
                        </Space>
                    )}
                </Col>
            </Row>

            <Divider />

            {/* Mariages */}
            <Title level={5}>
                <HeartOutlined /> Mariages & Conjoint(e)s
            </Title>
            {family.marriages.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Aucun mariage enregistré" />
            )}
            {family.marriages.map((m) => {
                const spouse = m.husbandId === profileId ? m.wife : m.husband;
                return (
                    <Card key={m.id} size="small" style={{ marginBottom: 8 }}>
                        <Card.Meta
                            avatar={<Avatar icon={<HeartOutlined />} style={{ background: '#f5222d' }} />}
                            title={
                                <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={() => router.push(`/profiles/${spouse.id}`)}
                                >
                                    {spouse.firstName} {spouse.lastName}
                                </Button>
                            }
                            description={
                                <Space>
                                    {m.marriageDate && (
                                        <Text type="secondary">Marié(e) le {formatDate(m.marriageDate)}</Text>
                                    )}
                                    {m.endDate && (
                                        <Tag color="default">Terminé le {formatDate(m.endDate)}</Tag>
                                    )}
                                    {canEdit && (
                                        <Popconfirm
                                            title="Supprimer ce mariage ?"
                                            onConfirm={() =>
                                                removeMarriage(m.id, {
                                                    onSuccess: () => { messageApi.success('Mariage supprimé'); refetch(); },
                                                })
                                            }
                                            okText="Supprimer"
                                            cancelText="Annuler"
                                        >
                                            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                                                Supprimer
                                            </Button>
                                        </Popconfirm>
                                    )}
                                </Space>
                            }
                        />
                    </Card>
                );
            })}
            {canEdit && (
                <Space style={{ marginTop: 8, flexWrap: 'wrap' as const }}>
                    <ProfileSelect
                        value={spouseId}
                        onChange={setSpouseId}
                        placeholder="Choisir le/la conjoint(e)..."
                        excludeId={profileId}
                    />
                    <DatePicker
                        placeholder="Date de mariage (optionnel)"
                        format="DD/MM/YYYY"
                        value={marriageDate}
                        onChange={setMarriageDate}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddMarriage}
                        disabled={!spouseId}
                    >
                        Ajouter mariage
                    </Button>
                </Space>
            )}

            <Divider />

            {/* Enfants */}
            <Title level={5}>Enfants ({family.children.length})</Title>
            {family.children.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Aucun enfant enregistré" />
            ) : (
                <Row gutter={[8, 8]}>
                    {family.children.map((c) => (
                        <Col key={c.id} xs={24} sm={12} md={8}>
                            <ProfileMemberCard
                                id={c.id}
                                name={`${c.firstName} ${c.lastName}`}
                                label="Enfant"
                                isAdmin={false}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <Divider />

            {/* Frères & Sœurs */}
            <Title level={5}>Frères & Sœurs ({family.siblings.length})</Title>
            {family.siblings.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Aucun frère/sœur enregistré" />
            ) : (
                <Row gutter={[8, 8]}>
                    {family.siblings.map((s) => (
                        <Col key={s.id} xs={24} sm={12} md={8}>
                            <ProfileMemberCard
                                id={s.id}
                                name={`${s.firstName} ${s.lastName}`}
                                label="Frère/Sœur"
                                isAdmin={false}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};
