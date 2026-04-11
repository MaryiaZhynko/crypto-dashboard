/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TICKER_API_URL?: string;
  readonly VITE_TICKER_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
