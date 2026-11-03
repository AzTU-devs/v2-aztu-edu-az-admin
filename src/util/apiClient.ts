import axios from 'axios';
import { RootState, store } from "../redux/store";
import { logout, setSession, tokenRefreshed } from "../redux/slices/authSlice";
import type { MeData, PermissionDeniedError } from "../types/rbac";

// export const API_BASE_URL = 'http://10.3.43.88:8000';
// export const API_BASE_URL = 'https://api-aztu.karamshukurlu.site';
// export const API_BASE_URL = 'http://localhost:8000';
export const API_BASE_URL = 'https://api.aztu.edu.az';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = (store.getState() as RootState).auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!config.headers["Accept-Language"]) {
            config.headers["Accept-Language"] = "az";
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const PERMISSION_DENIED_EVENT = 'aztu:permission-denied';

export type PermissionDeniedDetail = {
    required_permission: string | null;
    detail: string | null;
    method: string;
    path: string;
};

const emitPermissionDenied = (detail: PermissionDeniedDetail) => {
    window.dispatchEvent(new CustomEvent(PERMISSION_DENIED_EVENT, { detail }));
};

export const fetchMe = async (): Promise<MeData | null> => {
    try {
        const response = await apiClient.get('/api/auth/me');
        if (response.data?.status_code === 200 && response.data?.data) {
            return response.data.data as MeData;
        }
        return null;
    } catch {
        return null;
    }
};

let refreshInFlight: Promise<string> | undefined;

export function refreshAccessToken(): Promise<string> {
    if (!refreshInFlight) {
        refreshInFlight = apiClient.post('/api/auth/refresh', {}, { withCredentials: true })
            .then(response => {
                const token = response.data.access_token as string;
                if (!token) throw new Error('Missing access token');
                store.dispatch(tokenRefreshed({ token }));
                return token;
            }).finally(() => { refreshInFlight = undefined; });
    }
    return refreshInFlight;
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const isAuthEndpoint =
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/logout') ||
            originalRequest.url?.includes('/auth/me') ||
            originalRequest.url?.includes('/auth/mfa/confirm');

        if (error.response?.status === 403 && !isAuthEndpoint) {
            const body = error.response.data as Partial<PermissionDeniedError> | undefined;
            emitPermissionDenied({
                required_permission: body?.required_permission ?? null,
                detail: body?.detail ?? null,
                method: (originalRequest.method ?? 'get').toUpperCase(),
                path: originalRequest.url ?? '',
            });
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            try {
                const access_token = await refreshAccessToken();

                const me = await fetchMe();
                if (!me) throw new Error("Unable to verify the refreshed session");
                store.dispatch(setSession(me));

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                window.location.href = '/signin';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
