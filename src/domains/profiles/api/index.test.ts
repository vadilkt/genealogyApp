import { apiClient } from '@/configs';

import {
    createProfile,
    getProfile,
    searchProfiles,
    updateProfile,
    deleteProfile,
    getProfileWarnings,
} from './index';
import { mockProfile, mockProfiles, mockValidationWarnings } from './mocks';

jest.mock('@/configs', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('Profiles API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a profile', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: mockProfile });

        const result = await createProfile({
            firstName: 'Jean',
            lastName: 'Dupont',
            gender: 'MALE',
            dateOfBirth: '1985-03-15T00:00:00Z',
            residence: 'Paris',
        });

        expect(apiClient.post).toHaveBeenCalledWith('/profile', expect.any(Object));
        expect(result).toEqual(mockProfile);
    });

    it('should get a profile by id', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProfile });

        const result = await getProfile(1);

        expect(apiClient.get).toHaveBeenCalledWith('/profile/1');
        expect(result).toEqual(mockProfile);
    });

    it('should search profiles', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProfiles });

        const result = await searchProfiles('Dupont');

        expect(apiClient.get).toHaveBeenCalledWith('/profile/search?keyword=Dupont');
        expect(result).toEqual(mockProfiles);
    });

    it('should search profiles without keyword', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProfiles });

        const result = await searchProfiles();

        expect(apiClient.get).toHaveBeenCalledWith('/profile/search');
        expect(result).toEqual(mockProfiles);
    });

    it('should update a profile', async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: mockProfile });

        const result = await updateProfile(1, { firstName: 'Jean-Pierre' });

        expect(apiClient.put).toHaveBeenCalledWith('/profile/1', { firstName: 'Jean-Pierre' });
        expect(result).toEqual(mockProfile);
    });

    it('should delete a profile', async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({});

        await deleteProfile(1);

        expect(apiClient.delete).toHaveBeenCalledWith('/profile/1');
    });

    it('should get profile warnings', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockValidationWarnings });

        const result = await getProfileWarnings(1);

        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/warnings');
        expect(result).toEqual(mockValidationWarnings);
    });
});
