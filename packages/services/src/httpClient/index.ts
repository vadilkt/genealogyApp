export interface HttpClientConfig {
    baseUrl: string;
    headers?: Record<string, string>;
    interceptors?: {
        request?: (config: RequestInit) => RequestInit;
        response?: (response: Response) => Response;
    };
}

export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
}

export interface ApiError {
    message: string;
    status: number;
    data?: unknown;
}

export class HttpClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private interceptors: HttpClientConfig['interceptors'];

    constructor(config: HttpClientConfig) {
        this.baseUrl = config.baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config.headers,
        };
        this.interceptors = config.interceptors;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        let config: RequestInit = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...(options.headers as Record<string, string>),
            },
        };

        if (this.interceptors?.request) {
            config = this.interceptors.request(config);
        }

        try {
            let response = await fetch(url, config);

            if (this.interceptors?.response) {
                response = this.interceptors.response(response);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const error: ApiError = {
                    message: response.statusText,
                    status: response.status,
                    data: errorData,
                };
                throw error;
            }

            const contentType = response.headers.get('content-type');
            let data: T;
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                data = null as T;
            } else if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = (await response.text()) as unknown as T;
            }
            return {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            };
        } catch (error) {
            if ((error as ApiError).status) {
                throw error;
            }
            throw {
                message: (error as Error).message || 'Network error',
                status: 0,
                data: null,
            } as ApiError;
        }
    }

    async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    setHeader(key: string, value: string): void {
        this.defaultHeaders[key] = value;
    }

    removeHeader(key: string): void {
        delete this.defaultHeaders[key];
    }
}
