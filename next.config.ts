import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/ab-testing",
  output: "standalone",
  serverExternalPackages: ["puppeteer"],
  env: {
    NEXT_PUBLIC_BASE_PATH: "/ab-testing",
  },
};

export default nextConfig;
