import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["3000-" + process.env.BASE44_PUBLIC_HOST_SUFFIX],
  serverExternalPackages: ["pg", "puppeteer-core"],
  async redirects() {
    return [{ source: "/klient", destination: "/klien", permanent: false }];
  },
};

export default nextConfig;
