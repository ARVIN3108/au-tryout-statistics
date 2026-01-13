export type DebounceFunction = <T extends (...args: string[]) => void>(
  func: T,
  wait: number,
) => (...args: Parameters<T>) => void;

/**
 * Creates a debounced version of a function that delays its execution until
 * after `delay` milliseconds have passed since the last time it was invoked.
 * @param func The function to debounce. It can take any number of arguments and return anything.
 * @param delay The number of milliseconds to wait after the last call before executing the function.
 * @returns A new function that, when called, will debounce the execution of `func`.
 */
export function debounce<T extends (...args: T[]) => T>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  // Use `NodeJS.Timeout` or `number` (depending on environment) for the timeout ID
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  // The returned function's arguments match the original function's arguments
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    // Clear the previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      // Execute the original function with the correct 'this' context and arguments
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Converts a date string in "DD-MM-YY" format to a locale-aware, human-readable
 * date string (e.g., "15-05-25" -> "15 Mei 2025").
 * * @param dateString The date string in "DD-MM-YY" format.
 * @returns The formatted date string according to the 'id-ID' locale.
 */
export function convertDateString(dateString: string): string {
  // Split the input string into day, month, and year parts
  const parts: string[] = dateString.split("-");

  // Basic check to ensure we have the correct number of parts
  if (parts.length !== 3) {
    // Optionally throw an error or return a default value for invalid input
    console.error("Invalid date string format. Expected 'DD-MM-YY'.");
    return "Invalid Date";
  }

  // Parse the parts as integers
  const day: number = parseInt(parts[0], 10);
  // Months are 0-indexed in JavaScript, so subtract 1
  const month: number = parseInt(parts[1], 10) - 1;
  // Convert two-digit year to a four-digit year (e.g., 25 -> 2025)
  // Assuming years are in the 21st century (2000s)
  const year: number = 2000 + parseInt(parts[2], 10);

  // Create a new Date object
  // Note: Date validation relies on correct input, as Date constructor can be forgiving
  const date: Date = new Date(year, month, day);

  // Check if the created date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date values provided in the string.");
    return "Invalid Date";
  }

  // Use Intl.DateTimeFormat for locale-aware formatting
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  // Format the date using the Indonesian locale (id-ID)
  return new Intl.DateTimeFormat("id-ID", options).format(date);
}

/**
 * The data type for supported parameter values: a string, number, boolean, or an array of any of these types.
 */
type ParamValue = string | number | boolean | undefined;

/**
 * The data type for the parameter object used as a function input.
 */
type Params = {
  [key: string]: ParamValue | ParamValue[];
};

/**
 * Builds a complete URL string by combining a base path and a parameter object
 * into a URL query string, using the modern URLSearchParams API for safe encoding.
 * * @param path The base URL path (e.g., "/api/resource").
 * @param params The parameter object containing key-value pairs (Params type).
 * @returns The final URL with the query string appended, or just the path if no parameters are present.
 */
export function buildURL(path: string, params: Params): string {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value == undefined || value == null || String(value) == "") return;

    if (Array.isArray(value))
      // URLSearchParams automatically handles arrays by appending the key repeatedly.
      value.forEach((item) => searchParams.append(key, String(item)));
    else searchParams.append(key, String(value));
  });

  console.log(searchParams);

  const queryString = searchParams.toString();

  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Converts a value into an array of strings,
 * handling cases for a single string, an array of strings, and nullish values.
 *
 * @param value The value, which may be of type string | string[] | undefined | null.
 * @returns A guaranteed array of strings (string[]).
 */
export function toArrayOfString(
  value: string | string[] | undefined | null,
): string[] {
  // 1. Handle undefined, null, or other "nullish" values
  if (value === undefined || value === null) {
    return [];
  }

  // 2. Handle the case where the value is already an array
  if (Array.isArray(value)) {
    // Assumption: If it's already an array, we return it as is (assuming its contents are strings)
    return value;
  }

  // 3. Handle the case where the value is a single string
  // (Since we have passed the array and nullish checks, the remaining case is a string
  // or another unexpected type, but we treat it as a string)
  if (typeof value === "string") {
    return [value];
  }

  // Optional: Handle unexpected data types (e.g., numbers)
  // If there are other types, we can return an empty array or convert it to a string
  // For consistency, we convert it to a string and wrap it.
  return [String(value)];
}

export function isLessonAvailable(defaultLesson: string, lesson: string) {
  if (defaultLesson != lesson) return defaultLesson;
  return lesson;
}

/**
 * Converts a 17-character raw ID into the formatted version.
 * @param rawStr - e.g., "T3250501050600018"
 */
export function formatTKAIdString(rawStr: string): string {
  if (rawStr.length !== 17) return rawStr; // Basic validation

  return [
    rawStr.slice(0, 2), // T3
    rawStr.slice(2, 4), // 25
    rawStr.slice(4, 6), // 05
    rawStr.slice(6, 8), // 01
    rawStr.slice(8, 12), // 0506
    rawStr.slice(12, 16), // 0001
    rawStr.slice(16), // 8
  ].join("-");
}
