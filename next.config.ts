import type { NextConfig } from "next";
import date from "./date.json";
const data = date.utbk[0];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: `/utbk/${data.date}/${data.types[0]}`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
