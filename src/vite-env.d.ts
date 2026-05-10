/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface IRuntimeConfig {
  apiBaseUrl: string;
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: IRuntimeConfig;
  }
}

export {};
