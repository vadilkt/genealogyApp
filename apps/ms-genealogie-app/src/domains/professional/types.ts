export interface ProfessionalProfile {
    id: number;
    profession: string;
    entreprise: string;
    ville: string;
    dateDebut: string;
    dateFin: string | null;
    description: string | null;
}

export interface CreateProfessionalPayload {
    profession: string;
    entreprise: string;
    ville: string;
    dateDebut: string;
    dateFin?: string | null;
    description?: string | null;
}

export interface UpdateProfessionalPayload {
    profession?: string;
    entreprise?: string;
    ville?: string;
    dateDebut?: string;
    dateFin?: string | null;
    description?: string | null;
}
