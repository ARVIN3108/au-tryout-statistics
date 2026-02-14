import type { NextConfig } from "next";
import date from "./date.json";
const type = "toefl";
const data = date[type][0];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: `/${type}/${data.date}/${data.types[0]}`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
