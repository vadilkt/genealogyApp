import { apiClient } from '@/configs';

import { createPlace, getPlaces, getPlace } from './index';
import { mockPlace, mockPlaces } from './mocks';

jest.mock('@/configs', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

describe('Places API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a place', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: mockPlace });

        const result = await createPlace({ city: 'Paris', country: 'France', region: 'Île-de-France' });

        expect(apiClient.post).toHaveBeenCalledWith('/places', {
            city: 'Paris',
            country: 'France',
            region: 'Île-de-France',
        });
        expect(result).toEqual(mockPlace);
    });

    it('should get all places', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPlaces });

        const result = await getPlaces();

        expect(apiClient.get).toHaveBeenCalledWith('/places');
        expect(result).toEqual(mockPlaces);
    });

    it('should get a place by id', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPlace });

        const result = await getPlace(1);

        expect(apiClient.get).toHaveBeenCalledWith('/places/1');
        expect(result).toEqual(mockPlace);
    });
});
