import apiClient from '../../util/apiClient';
import type { ApiMessage, MeData, MeResponse } from '../../types/rbac';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  recovery_codes?: string[];
}

export interface MFASetupResponse {
  mfa_setup_required: true;
  setup_token: string;
  secret: string;
  provisioning_uri: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

const authService = {
  login: async (username: string, password: string, code = ""): Promise<LoginResponse | MFASetupResponse> => {
    const response = await apiClient.post<LoginResponse | MFASetupResponse>(
      '/api/auth/login',
      { username, password, ...(/^\d{6}$/.test(code) ? { otp_code: code } : code ? { recovery_code: code } : {}) },
      { withCredentials: true }
    );
    return response.data;
  },

  confirmMfa: async (setup_token: string, otp_code: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/mfa/confirm', { setup_token, otp_code });
    return response.data;
  },

  refresh: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/refresh',
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  /** Any authenticated admin may call this — no permission required. */
  me: async (): Promise<MeData> => {
    const response = await apiClient.get<MeResponse>('/api/auth/me');
    return response.data.data;
  },

  /**
   * Self-service — any authenticated admin, regardless of role. The server
   * rotates the refresh cookie, so this call must carry credentials or the
   * caller keeps a cookie that no longer matches the stored hash.
   */
  changePassword: async (payload: ChangePasswordPayload): Promise<string> => {
    const response = await apiClient.post<ApiMessage>(
      '/api/auth/change-password',
      payload,
      { withCredentials: true }
    );
    return response.data.message;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout', {}, { withCredentials: true });
  },
};

export default authService;
