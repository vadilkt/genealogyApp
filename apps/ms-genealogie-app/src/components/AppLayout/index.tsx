import {
    UserOutlined,
    TeamOutlined,
    PlusOutlined,
    SafetyOutlined,
    LogoutOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Typography, Button, Space, Tag } from 'antd';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import { useAuthContext } from '@/contexts/AuthContext';
import { useMyProfile } from '@/domains/profiles/useProfiles';

import styles from './AppLayout.module.scss';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const { user, isAdmin, clearAuth } = useAuthContext();
    const router = useRouter();
    const { data: myProfile } = useMyProfile();

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    const handleAvatarClick = () => {
        if (myProfile) {
            router.push(`/profiles/${myProfile.id}`);
        } else {
            router.push('/profiles/new');
        }
    };

    const menuItems = [
        {
            key: '/',
            icon: <TeamOutlined />,
            label: isAdmin ? 'Gestion des Profils' : 'Liste des Profils',
            onClick: () => router.push('/'),
        },
        ...(!isAdmin
            ? [
                  {
                      key: myProfile ? `/profiles/${myProfile.id}` : '/profiles/new',
                      icon: <UserOutlined />,
                      label: myProfile ? 'Mon Profil' : 'Créer mon profil',
                      onClick: handleAvatarClick,
                  },
              ]
            : []),
        ...(isAdmin
            ? [
                  {
                      key: '/profiles/new',
                      icon: <PlusOutlined />,
                      label: 'Nouveau Profil',
                      onClick: () => router.push('/profiles/new'),
                  },
                  {
                      type: 'divider' as const,
                  },
                  {
                      key: 'admin-group',
                      icon: <SafetyOutlined />,
                      label: 'Administration',
                      children: [
                          {
                              key: '/admin/places',
                              icon: <EnvironmentOutlined />,
                              label: 'Gérer les Lieux',
                              onClick: () => router.push('/admin/places'),
                          },
                      ],
                  },
              ]
            : []),
    ];

    const selectedKey = (() => {
        const path = router.pathname;
        if (path === '/') return '/';
        if (path === '/profiles/new') return '/profiles/new';
        if (path === '/admin/places') return '/admin/places';
        if (myProfile && router.query.id && Number(router.query.id) === myProfile.id) {
            return `/profiles/${myProfile.id}`;
        }
        return '';
    })();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark" width={230} className={styles.sider} style={{ background: 'linear-gradient(180deg, #2d1a0e 0%, #1a0d06 100%)' }}>
                <div className={styles.logo}>
                    <Text className={styles.logoTitle}>MS Généalogie</Text>
                    <Text className={styles.logoSubtitle}>Gestion familiale</Text>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    defaultOpenKeys={['admin-group']}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                />
            </Sider>

            <Layout style={{ marginLeft: 230 }}>
                <Header className={styles.header}>
                    <Space size={16} align="center">
                        <Avatar
                            size={32}
                            icon={<UserOutlined />}
                            style={{ background: isAdmin ? '#6b21a8' : '#f97316', cursor: isAdmin ? 'default' : 'pointer' }}
                            onClick={isAdmin ? undefined : handleAvatarClick}
                        />
                        {isAdmin ? (
                            <Tag
                                icon={<SafetyOutlined />}
                                color="purple"
                                style={{ fontWeight: 600, fontSize: 13 }}
                            >
                                ADMIN
                            </Tag>
                        ) : (
                            <Text style={{ fontWeight: 500 }}>{user?.username}</Text>
                        )}
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{ color: '#888' }}
                        >
                            Déconnexion
                        </Button>
                    </Space>
                </Header>

                <Content className={styles.content}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
