/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_SERVER: boolean;
  readonly VITE_AUTH_BASE_URL: string;
  readonly VITE_CENTRAL_SERVICES_BASE_URL: string;
  readonly VITE_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
