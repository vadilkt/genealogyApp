export interface Place {
    id: number;
    city: string;
    country: string;
    region: string | null;
}

export interface CreatePlacePayload {
    city: string;
    country: string;
    region?: string | null;
}
