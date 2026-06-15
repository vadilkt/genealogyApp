import { useMutation } from '@tanstack/react-query';

import { login, register } from '../api';
import type { LoginPayload, RegisterPayload } from '../types';

export const useLogin = () => {
    return useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: (payload: RegisterPayload) => register(payload),
    });
};
