import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // outras opções aqui
  images: {
    domains: [
      "images.pexels.com",
    ],
  },
  eslint: {
    // ⚠️ Ignora erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
