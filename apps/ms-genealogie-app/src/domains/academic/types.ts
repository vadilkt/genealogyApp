export interface AcademicProfile {
    id: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string | null;
    grade: string | null;
}

export interface CreateAcademicPayload {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string | null;
    grade?: string | null;
}

export interface UpdateAcademicPayload {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string | null;
    grade?: string | null;
}
