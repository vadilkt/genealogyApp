import { useCallback, useState } from 'react';

export const useToggle = (initialValue = false): [boolean, () => void] => {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue((v) => !v), []);
    return [value, toggle];
};

export const useDisclosure = (initialValue = false) => {
    const [isOpen, setIsOpen] = useState(initialValue);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((v) => !v), []);

    return { isOpen, open, close, toggle };
};
