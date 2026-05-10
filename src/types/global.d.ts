// * Global runtime configuration injected by index.html before the app boots
export {};

declare global {
  interface IRuntimeConfig {
    apiBaseUrl: string;
  }

  interface Window {
    __RUNTIME_CONFIG__: IRuntimeConfig;
  }
}
