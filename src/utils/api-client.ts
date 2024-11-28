import axios from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../config/constants';
import type { ApiError } from '../types/mikrotik';

export const createApiClient = (baseURL?: string) => {
  // Validate environment variables
  if (!process.env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not set. Using default value.');
  }

  const client = axios.create({
    baseURL: baseURL || API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

  client.interceptors.request.use(
    (config) => {
      // Add router IP to baseURL if provided in auth
      if (config.auth && config.auth.username) {
        const routerIP = config.url?.includes('://') ? '' : config.auth.username.split('@')[1];
        if (routerIP) {
          config.baseURL = `http://${routerIP}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const customError: ApiError = {
        customMessage: ERROR_MESSAGES.UNKNOWN_ERROR,
        status: error.response?.status,
        data: error.response?.data
      };

      if (error.code === 'ECONNABORTED') {
        customError.customMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
      } else if (!error.response) {
        customError.customMessage = ERROR_MESSAGES.NETWORK_ERROR;
      } else {
        switch (error.response.status) {
          case 401:
            customError.customMessage = ERROR_MESSAGES.AUTH_ERROR;
            break;
          case 403:
            customError.customMessage = 'Access forbidden. Your account may not have sufficient permissions.';
            break;
          case 404:
            customError.customMessage = 'Router API endpoint not found. Please check if the router supports PPTP and REST API.';
            break;
          case 500:
            customError.customMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;
          case 503:
            customError.customMessage = 'PPTP service unavailable. Please ensure PPTP client package is installed on the router.';
            break;
        }
      }

      return Promise.reject(customError);
    }
  );

  return client;
};