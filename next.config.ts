import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/ab-testing",
  output: "standalone",
  serverExternalPackages: ["puppeteer"],
};

export default nextConfig;
