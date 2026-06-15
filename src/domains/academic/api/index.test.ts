import { apiClient } from '@/configs';

import {
    createAcademic,
    getAcademic,
    getAcademicsByProfile,
    updateAcademic,
    deleteAcademic,
} from './index';
import { mockAcademicProfile, mockAcademicProfiles } from './mocks';

jest.mock('@/configs', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('Academic API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an academic profile', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: mockAcademicProfile });

        const result = await createAcademic(1, {
            institution: 'Université Paris-Saclay',
            degree: 'Master',
            fieldOfStudy: 'Informatique',
            startDate: '2015-09-01T00:00:00Z',
        });

        expect(apiClient.post).toHaveBeenCalledWith('/profile/1/academic', expect.any(Object));
        expect(result).toEqual(mockAcademicProfile);
    });

    it('should get an academic profile by id', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAcademicProfile });

        const result = await getAcademic(1);

        expect(apiClient.get).toHaveBeenCalledWith('/profile/academic/1');
        expect(result).toEqual(mockAcademicProfile);
    });

    it('should get all academic profiles by profile id', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAcademicProfiles });

        const result = await getAcademicsByProfile(1);

        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/academic');
        expect(result).toEqual(mockAcademicProfiles);
    });

    it('should update an academic profile', async () => {
        (apiClient.put as jest.Mock).mockResolvedValue({ data: mockAcademicProfile });

        const result = await updateAcademic(1, { degree: 'Doctorat' });

        expect(apiClient.put).toHaveBeenCalledWith('/profile/academic/1', { degree: 'Doctorat' });
        expect(result).toEqual(mockAcademicProfile);
    });

    it('should delete an academic profile', async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({});

        await deleteAcademic(1);

        expect(apiClient.delete).toHaveBeenCalledWith('/profile/academic/1');
    });
});
