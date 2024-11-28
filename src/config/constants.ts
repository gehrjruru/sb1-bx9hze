export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8728',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
  ENDPOINTS: {
    SYSTEM: {
      IDENTITY: '/rest/system/identity',
      RESOURCE: '/rest/system/resource',
      HEALTH: '/rest/system/health'
    },
    PPTP_CLIENT: '/rest/interface/pptp-client'
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the router. Please check the IP address and network connection.',
  TIMEOUT_ERROR: 'Connection timed out. Please verify the router is accessible.',
  AUTH_ERROR: 'Authentication failed. Please check your username and password.',
  SERVER_ERROR: 'Router error occurred. Please check the router status.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;