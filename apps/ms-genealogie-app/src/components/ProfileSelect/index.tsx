import { Select, Spin } from 'antd';
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
    placeholder = 'Rechercher un profil...',
    excludeId,
    disabled,
}: ProfileSelectProps) => {
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
            placeholder={placeholder}
            notFoundContent={isFetching ? <Spin size="small" /> : 'Aucun profil trouvé'}
            options={options}
            style={{ width: '100%' }}
            disabled={disabled}
            allowClear
        />
    );
};
