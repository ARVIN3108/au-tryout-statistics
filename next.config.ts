import type { NextConfig } from "next";
import date from "./date.json";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/toefl/" + date.toefl[0].date + "/toefl",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
