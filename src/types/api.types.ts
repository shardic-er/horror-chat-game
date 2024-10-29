export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

export interface ApiError {
    message: string;
    code: string;
    status: number;
}

export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    headers?: Record<string, string>;
}