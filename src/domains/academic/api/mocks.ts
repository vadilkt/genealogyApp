import type { AcademicProfile } from '../types';

export const mockAcademicProfile: AcademicProfile = {
    id: 1,
    institution: 'Université Paris-Saclay',
    degree: 'Master',
    fieldOfStudy: 'Informatique',
    startDate: '2015-09-01T00:00:00Z',
    endDate: '2017-06-30T00:00:00Z',
    grade: 'Mention Bien',
};

export const mockAcademicProfiles: AcademicProfile[] = [
    mockAcademicProfile,
    {
        id: 2,
        institution: 'École Polytechnique',
        degree: 'Licence',
        fieldOfStudy: 'Mathématiques',
        startDate: '2012-09-01T00:00:00Z',
        endDate: '2015-06-30T00:00:00Z',
        grade: null,
    },
];
