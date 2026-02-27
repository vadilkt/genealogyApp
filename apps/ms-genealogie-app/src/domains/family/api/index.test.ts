import { apiClient } from '@/configs';

import {
    getFamily,
    getAncestors,
    getDescendants,
    getParents,
    getChildren,
    getSpouses,
    getSiblings,
    setFather,
    setMother,
    removeFather,
    removeMother,
    addMarriage,
    removeMarriage,
} from './index';
import { mockFamilyResponse, mockAncestorNode, mockDescendantNode, mockMarriage } from './mocks';

jest.mock('@/configs', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('Family API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get family', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockFamilyResponse });
        const result = await getFamily(1);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/family');
        expect(result).toEqual(mockFamilyResponse);
    });

    it('should get ancestors with default depth', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAncestorNode });
        const result = await getAncestors(1);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/ancestors?depth=5');
        expect(result).toEqual(mockAncestorNode);
    });

    it('should get ancestors with custom depth', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAncestorNode });
        await getAncestors(1, 3);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/ancestors?depth=3');
    });

    it('should get descendants', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDescendantNode });
        const result = await getDescendants(1);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/descendants?depth=5');
        expect(result).toEqual(mockDescendantNode);
    });

    it('should get parents', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: mockFamilyResponse });
        await getParents(1);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/parents');
    });

    it('should get children', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
        await getChildren(1);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/children');
    });

    it('should get spouses', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
        await getSpouses(1);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/spouses');
    });

    it('should get siblings', async () => {
        (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
        await getSiblings(1);
        expect(apiClient.get).toHaveBeenCalledWith('/profile/1/siblings');
    });

    it('should set father', async () => {
        const profile = { id: 1, firstName: 'Jean' };
        (apiClient.put as jest.Mock).mockResolvedValue({ data: profile });
        await setFather(1, { parentProfileId: 2 });
        expect(apiClient.put).toHaveBeenCalledWith('/profile/1/father', { parentProfileId: 2 });
    });

    it('should set mother', async () => {
        const profile = { id: 1, firstName: 'Jean' };
        (apiClient.put as jest.Mock).mockResolvedValue({ data: profile });
        await setMother(1, { parentProfileId: 3 });
        expect(apiClient.put).toHaveBeenCalledWith('/profile/1/mother', { parentProfileId: 3 });
    });

    it('should remove father', async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({});
        await removeFather(1);
        expect(apiClient.delete).toHaveBeenCalledWith('/profile/1/father');
    });

    it('should remove mother', async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({});
        await removeMother(1);
        expect(apiClient.delete).toHaveBeenCalledWith('/profile/1/mother');
    });

    it('should add marriage', async () => {
        (apiClient.post as jest.Mock).mockResolvedValue({ data: mockMarriage });
        const result = await addMarriage(1, {
            spouseProfileId: 4,
            marriageDate: '2010-06-15T00:00:00Z',
        });
        expect(apiClient.post).toHaveBeenCalledWith('/profile/1/marriage', expect.any(Object));
        expect(result).toEqual(mockMarriage);
    });

    it('should remove marriage', async () => {
        (apiClient.delete as jest.Mock).mockResolvedValue({});
        await removeMarriage(1);
        expect(apiClient.delete).toHaveBeenCalledWith('/profile/marriage/1');
    });
});
