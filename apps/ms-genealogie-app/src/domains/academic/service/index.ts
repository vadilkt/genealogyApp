import type { AcademicProfile } from '../types';

export const sortAcademicByDate = (records: AcademicProfile[]): AcademicProfile[] => {
    return [...records].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
};

export const filterOngoingStudies = (records: AcademicProfile[]): AcademicProfile[] => {
    return records.filter((record) => record.endDate === null);
};

export const getAcademicSummary = (record: AcademicProfile): string => {
    return `${record.degree} en ${record.fieldOfStudy} — ${record.institution}`;
};
