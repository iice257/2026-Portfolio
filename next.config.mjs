const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
};

export default nextConfig;
