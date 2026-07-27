import type { NextConfig } from "next";
import data from "./data.json";

interface NewestDateResult {
  generation: string | null;
  type: string | null;
  data: {
    date: string;
    types: string[];
    compatibility: string[];
  } | null;
}

function getNewestDate(): NewestDateResult {
  const generations = Object.keys(data) as Array<keyof typeof data>;
  let newestTime = -Infinity;

  // Initialize the accumulator for our 4-segment route data
  let bestMatch: NewestDateResult = {
    generation: null,
    type: null,
    data: null,
  };

  // Helper to convert "D-M-YY" or "DD-MM-YY" to a timestamp
  const parseDateToTime = (dateStr: string): number => {
    const [day, month, year] = dateStr.split("-").map(Number);
    // Year is 20xx (2000 + year), Month is 0-indexed in JS Date
    return new Date(2000 + year, month - 1, day).getTime();
  };

  // Outer Loop: Traverse Generations ("elvozthern", "songolas", etc.)
  for (const gen of generations) {
    const genData = data[gen];
    const types = Object.keys(genData) as Array<keyof typeof genData>;

    // Inner Loop: Traverse Exam Types ("utbk", "tka", "toefl", etc.)
    for (const type of types) {
      const scheduleArray = genData[type];
      const firstItem = scheduleArray[0]; // Assumes array is sorted newest-to-oldest

      if (firstItem) {
        const currentTime = parseDateToTime(firstItem.date);

        if (currentTime > newestTime) {
          newestTime = currentTime;
          bestMatch = {
            generation: gen,
            type: type as string,
            data: firstItem,
          };
        }
      }
    }
  }

  return bestMatch;
}

const newestDate = getNewestDate();

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    // Safety guard: If no valid date was found in the JSON, return no redirects
    // to prevent malformed URL routing like "/null/null/null/null"
    if (!newestDate.generation || !newestDate.type || !newestDate.data) {
      return [];
    }

    return [
      {
        source: "/",
        destination: `/${newestDate.generation}/${newestDate.type}/${newestDate.data.date}/${newestDate.data.types[0]}`,
        permanent: false, // Keep false so returning users get evaluated dynamically as time advances
      },
    ];
  },
};

export default nextConfig;
