// * Centralized axios instance used by all feature data hooks.
// * Base URL is resolved from window.__RUNTIME_CONFIG__ so deployments can
// * rewire the API target without rebuilding the bundle.
import axios, { type AxiosInstance } from 'axios';

const DEFAULT_BASE_URL: string = '/api';

const resolveBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return DEFAULT_BASE_URL;
  }

  const runtimeConfig: IRuntimeConfig | undefined = window.__RUNTIME_CONFIG__;
  if (!runtimeConfig || !runtimeConfig.apiBaseUrl) {
    return DEFAULT_BASE_URL;
  }

  return runtimeConfig.apiBaseUrl;
};

export const httpClient: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;
