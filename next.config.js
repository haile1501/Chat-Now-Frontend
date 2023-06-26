/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/signin",
        permanent: true,
      },
    ];
  },
  serverRuntimeConfig: {
    // other server runtime configurations...
    host: "0.0.0.0",
  },
};

module.exports = nextConfig;
