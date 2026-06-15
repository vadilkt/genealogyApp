import { useCallback, useEffect, useRef } from 'react';

export const useDebounce = <T extends (...args: unknown[]) => void>(
    callback: T,
    delay: number,
): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args: unknown[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => callback(...args), delay);
        }) as T,
        [callback, delay],
    );
};
