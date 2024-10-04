/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_APP_ID: number;
  readonly VITE_SERVER_SECRET: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
