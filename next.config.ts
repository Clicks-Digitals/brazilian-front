import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/our-story", destination: "/contact", permanent: false },
      { source: "/journal", destination: "/articles", permanent: false },
      { source: "/journal/:slug", destination: "/articles/:slug", permanent: false },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/**" },
      { protocol: "https", hostname: "braziliancoffeehouse.com", pathname: "/**" },
      { protocol: "https", hostname: "www.braziliancoffeehouse.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
