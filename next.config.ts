import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.geoapify.com",
        port: "",
        pathname: "/v1/staticmap",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
