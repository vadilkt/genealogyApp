import { apiClient } from '@/configs';

import {
    createProfessional,
    getProfessional,
    getProfessionalsByProfile,
    updateProfessional,
    deleteProfessional,
} from './index';
import { mockProfessionalProfile, mockProfessionalProfiles } from './mocks';

jest.mock('@/configs', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('Professional API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a professional profile', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: mockProfessionalProfile });

        const result = await createProfessional(1, {
            profession: 'Ingénieur',
            entreprise: 'TechCorp',
            ville: 'Paris',
            dateDebut: '2010-09-01T00:00:00Z',
        });

        expect(apiClient.post).toHaveBeenCalledWith('/profile/1/professional', expect.any(Object));
        expect(result).toEqual(mockProfessionalProfile);
    });

    it('should get a professional profile by id', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProfessionalProfile });

        const result = await getProfessional(1);

        expect(apiClient.get).toHaveBeenCalledWith('/profile/professional/1');
        expect(result).toEqual(mockProfessionalProfile);
    });

    it('should get all professional profiles by profile id', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProfessionalProfiles });

        const result = await getProfessionalsByProfile(1);

        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/professional');
        expect(result).toEqual(mockProfessionalProfiles);
    });

    it('should update a professional profile', async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: mockProfessionalProfile });

        const result = await updateProfessional(1, { profession: 'Architecte' });

        expect(apiClient.put).toHaveBeenCalledWith('/profile/professional/1', { profession: 'Architecte' });
        expect(result).toEqual(mockProfessionalProfile);
    });

    it('should delete a professional profile', async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({});

        await deleteProfessional(1);

        expect(apiClient.delete).toHaveBeenCalledWith('/profile/professional/1');
    });
});
