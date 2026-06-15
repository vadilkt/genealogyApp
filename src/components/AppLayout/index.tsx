import {
    UserOutlined,
    TeamOutlined,
    PlusOutlined,
    SafetyOutlined,
    LogoutOutlined,
    EnvironmentOutlined,
    UsergroupAddOutlined,
    BellOutlined,
    ApartmentOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { Badge, Dropdown, Layout, Menu, Avatar, Typography, Button, Space, Tag, List } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuthContext } from '@/contexts/AuthContext';
import { useMyProfile } from '@/domains/profiles/useProfiles';
import { useMarkAllRead, useNotifications, useUnreadCount } from '@/domains/notifications/useNotifications';

import styles from './AppLayout.module.scss';

dayjs.extend(relativeTime);

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const { t } = useTranslation('common');
    const { user, isAdmin, clearAuth } = useAuthContext();
    const router = useRouter();
    const [siderCollapsed, setSiderCollapsed] = useState(false);
    const { data: myProfile } = useMyProfile();
    const { data: notifications = [] } = useNotifications();
    const { data: unreadCount = 0 } = useUnreadCount();
    const { mutate: markAllRead } = useMarkAllRead();

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    const isProfileEmpty = myProfile && !myProfile.firstName;

    const handleAvatarClick = () => {
        if (myProfile) {
            router.push(isProfileEmpty ? `/profiles/${myProfile.id}/edit` : `/profiles/${myProfile.id}`);
        }
    };

    const menuItems = [
        {
            key: '/',
            icon: <TeamOutlined />,
            label: isAdmin ? t('nav.profilesAdmin') : t('nav.profilesList'),
            onClick: () => router.push('/'),
        },
        {
            key: '/tree',
            icon: <ApartmentOutlined />,
            label: t('nav.globalTree'),
            onClick: () => router.push('/tree'),
        },
        ...(!isAdmin
            ? [
                  {
                      key: myProfile
                          ? isProfileEmpty
                              ? `/profiles/${myProfile.id}/edit`
                              : `/profiles/${myProfile.id}`
                          : '/profiles/new',
                      icon: <UserOutlined />,
                      label: isProfileEmpty
                          ? t('nav.completeMyProfile')
                          : myProfile
                              ? t('nav.myProfile')
                              : t('nav.createMyProfile'),
                      onClick: handleAvatarClick,
                  },
              ]
            : []),
        ...(isAdmin
            ? [
                  {
                      key: '/profiles/new',
                      icon: <PlusOutlined />,
                      label: t('nav.newProfile'),
                      onClick: () => router.push('/profiles/new'),
                  },
                  {
                      type: 'divider' as const,
                  },
                  {
                      key: 'admin-group',
                      icon: <SafetyOutlined />,
                      label: t('nav.administration'),
                      children: [
                          {
                              key: '/admin/users',
                              icon: <UsergroupAddOutlined />,
                              label: t('nav.manageUsers'),
                              onClick: () => router.push('/admin/users'),
                          },
                          {
                              key: '/admin/places',
                              icon: <EnvironmentOutlined />,
                              label: t('nav.managePlaces'),
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
        if (path === '/admin/users') return '/admin/users';
        if (path === '/tree') return '/tree';
        if (myProfile && router.query.id && Number(router.query.id) === myProfile.id) {
            return `/profiles/${myProfile.id}`;
        }
        return '';
    })();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                theme="dark"
                width={230}
                collapsedWidth={0}
                breakpoint="lg"
                collapsed={siderCollapsed}
                onCollapse={(val) => setSiderCollapsed(val)}
                className={styles.sider}
                style={{ background: 'linear-gradient(180deg, #2d1a0e 0%, #1a0d06 100%)' }}
            >
                <div className={styles.logo}>
                    <Text className={styles.logoTitle}>{t('appName')}</Text>
                    <Text className={styles.logoSubtitle}>{t('tagline')}</Text>
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

            <Layout style={{ marginLeft: siderCollapsed ? 0 : 230, transition: 'margin-left 0.2s' }}>
                <Header className={styles.header}>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setSiderCollapsed((v) => !v)}
                        className={styles.hamburger}
                        aria-label={t('nav.toggleMenu')}
                    />
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
                        <Dropdown
                            trigger={['click']}
                            onOpenChange={(open) => { if (open && unreadCount > 0) markAllRead(); }}
                            dropdownRender={() => (
                                <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', width: 340, maxHeight: 400, overflow: 'auto' }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>
                                        {t('nav.notifications')}
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '32px 16px', color: '#999', textAlign: 'center' }}>{t('nav.noNotifications')}</div>
                                    ) : (
                                        <List
                                            dataSource={notifications}
                                            renderItem={(n) => (
                                                <List.Item style={{ padding: '10px 16px', background: n.read ? 'transparent' : '#fff7ed', display: 'block' }}>
                                                    <div style={{ fontSize: 13, color: '#1a0d06', marginBottom: 4 }}>{n.message}</div>
                                                    <div style={{ fontSize: 11, color: '#aaa' }}>{dayjs(n.createdAt).fromNow()}</div>
                                                </List.Item>
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                        >
                            <Badge count={unreadCount} size="small">
                                <Button type="text" icon={<BellOutlined />} style={{ color: '#888' }} />
                            </Badge>
                        </Dropdown>
                        <LanguageSwitcher />
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{ color: '#888' }}
                        >
                            {t('common.logout')}
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
