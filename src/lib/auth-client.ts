import axios from 'axios';

const backendUrl = String(import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000').replace(/\/+$/, '').replace(/\/api$/, '');

const authApi = axios.create({
  baseURL: `${backendUrl}/api/auth`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: 'ADMIN' | 'APP_USER' | string;
  emailVerified?: boolean;
};

export type AuthSession = {
  session: { id: string; expiresAt: string; token?: string };
  user: AuthUser;
};

const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Authentication request failed';
};

export const authClient = {
  async getSession(): Promise<AuthSession | null> {
    try {
      const { data } = await authApi.get<AuthSession | null>('/get-session');
      return data?.user ? data : null;
    } catch {
      return null;
    }
  },

  async signUp(name: string, email: string, password: string): Promise<AuthSession | null> {
    try {
      const { data } = await authApi.post<AuthSession | { user?: AuthUser }>('/sign-up/email', { name, email, password });
      if (data?.user && 'session' in data) return data;
      return null;
    } catch (error) { throw new Error(errorMessage(error)); }
  },

  async signIn(email: string, password: string, rememberMe = true) {
    try {
      const { data } = await authApi.post<AuthSession>('/sign-in/email', {
        email,
        password,
        rememberMe,
      });
      return data;
    } catch (error) {
      throw new Error(errorMessage(error));
    }
  },


  async requestPasswordReset(email: string) {
    try {
      await authApi.post('/request-password-reset', { email, redirectTo: `${window.location.origin}/reset-password` });
    } catch (error) { throw new Error(errorMessage(error)); }
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      await authApi.post('/reset-password', { token, newPassword });
    } catch (error) { throw new Error(errorMessage(error)); }
  },

  async signOut() {
    try {
      await authApi.post('/sign-out');
    } catch (error) {
      throw new Error(errorMessage(error));
    }
  },

  async signInWithGoogle() {
    try {
      const { data } = await authApi.post<{ url?: string }>('/sign-in/social', {
        provider: 'google',
        callbackURL: window.location.origin,
      });
      if (!data.url) throw new Error('Google sign-in could not be started');
      window.location.assign(data.url);
    } catch (error) { throw new Error(errorMessage(error)); }
  },
};
