const nextConfig = {
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
