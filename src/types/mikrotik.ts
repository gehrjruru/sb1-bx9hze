export interface LocalAuthCredentials {
  ipAddress: string;
  username: string;
  password: string;
}

export interface PPTPCredentials {
  serverAddress: string;
  username: string;
  password: string;
  tunnelName?: string;
}

export interface PPTPConfig {
  name: string;
  connectTo: string;
  user: string;
  password: string;
  disabled: boolean;
}

export type AuthMethod = 'local' | 'pptp';

export type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
}

export type ApiError = {
  customMessage: string;
  status?: number;
  data?: any;
}