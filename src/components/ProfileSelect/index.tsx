import { Select, Spin } from 'antd';
import { useTranslation } from 'next-i18next';
import { useState, useCallback } from 'react';

import { useSearchProfiles } from '@/domains/profiles/useProfiles';

interface ProfileSelectProps {
    value?: number;
    onChange?: (value: number) => void;
    placeholder?: string;
    excludeId?: number;
    disabled?: boolean;
}

export const ProfileSelect = ({
    value,
    onChange,
    placeholder,
    excludeId,
    disabled,
}: ProfileSelectProps) => {
    const { t } = useTranslation('common');
    const [keyword, setKeyword] = useState('');
    const { data: profiles = [], isFetching } = useSearchProfiles(keyword || undefined);

    const handleSearch = useCallback((val: string) => {
        setKeyword(val);
    }, []);

    const options = profiles
        .filter((p) => p.id !== excludeId)
        .map((p) => ({
            value: p.id,
            label: `${p.firstName} ${p.lastName}`,
        }));

    return (
        <Select
            showSearch
            value={value}
            onChange={onChange}
            onSearch={handleSearch}
            filterOption={false}
            placeholder={placeholder ?? t('profileSelect.placeholder')}
            notFoundContent={isFetching ? <Spin size="small" /> : t('profileSelect.notFound')}
            options={options}
            style={{ width: '100%' }}
            disabled={disabled}
            allowClear
        />
    );
};
