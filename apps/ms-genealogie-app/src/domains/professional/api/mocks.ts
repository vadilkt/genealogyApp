import type { ProfessionalProfile } from '../types';

export const mockProfessionalProfile: ProfessionalProfile = {
    id: 1,
    profession: 'Ingénieur',
    entreprise: 'TechCorp',
    ville: 'Paris',
    dateDebut: '2010-09-01T00:00:00Z',
    dateFin: '2020-06-30T00:00:00Z',
    description: 'Développeur senior',
};

export const mockProfessionalProfiles: ProfessionalProfile[] = [
    mockProfessionalProfile,
    {
        id: 2,
        profession: 'Architecte',
        entreprise: 'BuildCo',
        ville: 'Lyon',
        dateDebut: '2020-07-01T00:00:00Z',
        dateFin: null,
        description: 'Architecte logiciel',
    },
];
