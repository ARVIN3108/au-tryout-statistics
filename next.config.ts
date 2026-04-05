import type { NextConfig } from "next";
import date from "./date.json";

function getNewestDate() {
  const types = Object.keys(date) as Array<keyof typeof date>;
  let newestTime = -Infinity;
  let result: keyof typeof date | null = null;

  // Helper to convert "D-M-YY" or "DD-MM-YY" to a timestamp
  const parseDateToTime = (dateStr: string): number => {
    const [day, month, year] = dateStr.split("-").map(Number);
    // Year is 20xx (2000 + year), Month is 0-indexed in JS
    return new Date(2000 + year, month - 1, day).getTime();
  };

  for (const type of types) {
    const firstItem = date[type][0];

    if (firstItem) {
      const currentTime = parseDateToTime(firstItem.date);

      if (currentTime > newestTime) {
        newestTime = currentTime;
        result = type;
      }
    }
  }

  return {
    type: result,
    data: result ? date[result][0] : null,
  };
}

const newestDate = getNewestDate();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: `/${newestDate.type}/${newestDate.data?.date}/${newestDate.data?.types[0]}`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
