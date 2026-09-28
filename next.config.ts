import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/klient", destination: "/klien", permanent: false }];
  },
};

export default nextConfig;
