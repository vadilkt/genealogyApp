import type { Profile } from '../profiles/types';

export interface FamilyResponse {
    father: Profile | null;
    mother: Profile | null;
    children: Profile[];
    siblings: Profile[];
    spouses: Profile[];
    marriages: Marriage[];
}

export interface AncestorNode {
    profile: Profile;
    father: AncestorNode | null;
    mother: AncestorNode | null;
}

export interface DescendantNode {
    profile: Profile;
    children: DescendantNode[];
}

export interface Marriage {
    id: number;
    husbandId: number;
    wifeId: number;
    husband: Profile;
    wife: Profile;
    marriageDate: string | null;
    endDate: string | null;
}

export interface CreateMarriagePayload {
    spouseProfileId: number;
    marriageDate?: string | null;
    endDate?: string | null;
}

export interface SetParentPayload {
    parentProfileId: number;
}
