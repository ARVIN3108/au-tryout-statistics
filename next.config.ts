import type { NextConfig } from "next";
import date from "./date.json";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/utbk/" + date.utbk[0].date + "/irt",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
