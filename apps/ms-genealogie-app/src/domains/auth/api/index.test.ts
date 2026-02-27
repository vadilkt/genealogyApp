import { apiClient } from '@/configs';

import { login, register } from './index';
import { mockAuthResponse, mockLoginPayload, mockRegisterPayload } from './mocks';

jest.mock('@/configs', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

describe('Auth API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should call POST /auth/login with credentials', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ data: mockAuthResponse });

            const result = await login(mockLoginPayload);

            expect(apiClient.post).toHaveBeenCalledWith('/auth/login', mockLoginPayload);
            expect(result).toEqual(mockAuthResponse);
        });
    });

    describe('register', () => {
        it('should call POST /auth/register with user data', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ data: 'Utilisateur créé' });

            const result = await register(mockRegisterPayload);

            expect(apiClient.post).toHaveBeenCalledWith('/auth/register', mockRegisterPayload);
            expect(result).toBe('Utilisateur créé');
        });
    });
});
