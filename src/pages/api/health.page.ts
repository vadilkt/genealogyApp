import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthCheckResponse {
    status: string;
    timestamp: string;
}

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse<HealthCheckResponse>,
) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
}
