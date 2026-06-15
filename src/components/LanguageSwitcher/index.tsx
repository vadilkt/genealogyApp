import { GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'next-i18next';

const LANGS = [
    { key: 'fr', label: 'Français' },
    { key: 'en', label: 'English' },
];

export const PREFERRED_LANG_KEY = 'preferredLang';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation('common');
    const current = (i18n.language ?? 'fr').slice(0, 2);

    const change = (lng: string) => {
        i18n.changeLanguage(lng);
        if (typeof window !== 'undefined') {
            localStorage.setItem(PREFERRED_LANG_KEY, lng);
        }
    };

    return (
        <Dropdown
            trigger={['click']}
            menu={{
                selectedKeys: [current],
                items: LANGS.map((l) => ({ key: l.key, label: l.label, onClick: () => change(l.key) })),
            }}
        >
            <Button type="text" icon={<GlobalOutlined />} style={{ color: '#888' }}>
                {current.toUpperCase()}
            </Button>
        </Dropdown>
    );
};
