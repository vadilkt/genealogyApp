import type { ProfessionalProfile } from '../types';

export const sortProfessionalByDate = (records: ProfessionalProfile[]): ProfessionalProfile[] => {
    return [...records].sort(
        (a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime(),
    );
};

export const filterCurrentPositions = (records: ProfessionalProfile[]): ProfessionalProfile[] => {
    return records.filter((record) => record.dateFin === null);
};

export const getProfessionalSummary = (record: ProfessionalProfile): string => {
    return `${record.profession} chez ${record.entreprise}, ${record.ville}`;
};
