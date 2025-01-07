/// <reference types="astro/client" />

type KVNamespace = import('@cloudflare/workers-types').KVNamespace;
type ENV = {
    POST_DB: KVNamespace;
    DKIM_PRIVATE_KEY: string;
    PUBLIC_TURNSTILE_SITE_KEY: string;
    SECRET_KEY: string;
};

// use a default runtime configuration (advanced mode).
type Runtime = import('@astrojs/cloudflare').Runtime<ENV>;
declare namespace App {
    interface Locals extends Runtime {}
}


interface ImportMetaEnv {
    readonly SECRET_KEY: string;
    readonly PUBLIC_TURNSTILE_SITE_KEY: string;
    // 更多环境变量…
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}