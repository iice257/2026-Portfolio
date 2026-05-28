const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "X-Download-Options",
    value: "noopen",
  },
  {
    key: "Origin-Agent-Cluster",
    value: "?1",
  },
];

const publicAssetCacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=86400, stale-while-revalidate=604800",
  },
];

const localBuildCompatibility =
  process.env.NEXT_LOCAL_BUILD_COMPAT === "1"
    ? {
        cpus: 1,
        workerThreads: true,
        webpackBuildWorker: false,
        parallelServerCompiles: false,
        parallelServerBuildTraces: false,
      }
    : undefined;

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  ...(localBuildCompatibility ? { experimental: localBuildCompatibility } : {}),
  async rewrites() {
    return [
      {
        source: "/skills",
        destination: "/",
      },
      {
        source: "/experience",
        destination: "/",
      },
      {
        source: "/contact",
        destination: "/",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/projects/:path*",
        headers: publicAssetCacheHeaders,
      },
      {
        source: "/projects/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicons/:path*",
        headers: publicAssetCacheHeaders,
      },
      {
        source: "/icon-:path*",
        headers: publicAssetCacheHeaders,
      },
      {
        source: "/:path(favicon.svg|logo.svg|manifest.json|portfolio.json|llms.txt|sitemap.xml|robots.txt)",
        headers: publicAssetCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
