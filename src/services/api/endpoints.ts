export const ENDPOINTS = {
    CHAT: '/v1/chat/completions',
    MODELS: '/v1/models',
    VALIDATION: '/v1/engines/davinci/completions'
};

export const API_ROUTES = {
    validateKey: () => ENDPOINTS.VALIDATION,
    chat: () => ENDPOINTS.CHAT,
    models: () => ENDPOINTS.MODELS
};