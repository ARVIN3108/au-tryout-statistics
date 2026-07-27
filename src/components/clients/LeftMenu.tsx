"use client";

import { Menu, Button } from "@material-tailwind/react";
import json from "../../../data.json";
import { useRouter } from "next/navigation";
import { buildURL, convertDateString } from "@/utils";
import { useCallback } from "react";

export default function LeftMenu({
  variable,
  searchVar,
  compatibility,
}: {
  variable: { [key: string]: string };
  searchVar: { [key: string]: string | string[] | undefined };
  compatibility: { [key: string]: string[] };
}) {
  const router = useRouter();

  // Safely navigate the 2-layer JSON hierarchy with fallbacks
  const genData = json[variable.generation as keyof typeof json];
  const data = genData[variable.type as keyof typeof genData];

  const getTypeName = (name: string | null = null) => {
    const typeName = (name || variable.type).toUpperCase();

    switch (typeName) {
      case "UTBK":
        return "SNBT - " + typeName;
      case "TKA":
        return "SNBP - " + typeName;
      case "TOEFL":
        return typeName + " - TOAFL";
      default:
        return typeName;
    }
  };

  const getLessonName = (name: string | null = null) => {
    const lessonName = (name || variable.lesson).toUpperCase();

    switch (lessonName) {
      case "REAL":
        name = "ASLI / " + lessonName;
        if (compatibility.utbk?.includes("EXTERNAL"))
          return name + " (AMANATUL UMMAH SAJA)";
        return name;
      case "TOAFL":
        return lessonName + " / KHOS";
      case "IRT":
        if (compatibility.utbk?.includes("EXTERNAL"))
          return lessonName + " (AMANATUL UMMAH SAJA)";
      case "EXTERNAL":
        if (compatibility.utbk?.includes("EXTERNAL"))
          return `ASLI / REAL (${lessonName} SAJA)`;
      case "MIX":
        if (compatibility.utbk?.includes("EXTERNAL"))
          return "ASLI / REAL (AMANATUL UMMAH + EXTERNAL)";
      default:
        return lessonName;
    }
  };

  const routeGeneration = useCallback(
    (newGeneration: string, method = "push") => {
      // 1. Avoid unnecessary routing if the user is already on this generation
      if (variable.generation !== newGeneration) {
        const targetGenData = json[newGeneration as keyof typeof json];

        // Safety guard against invalid generation keys
        if (!targetGenData) return;

        // 2. Resolve TYPE: Try to preserve current type, else fallback to first available
        const availableTypes = Object.keys(targetGenData) as Array<
          keyof typeof targetGenData
        >;
        const targetType = availableTypes.includes(
          variable.type as keyof typeof targetGenData,
        )
          ? variable.type
          : (availableTypes[0] as string);

        if (!targetType) return;
        const targetTypeArray =
          targetGenData[targetType as keyof typeof targetGenData];
        if (!targetTypeArray || targetTypeArray.length === 0) return;

        // 3. Resolve DATE: Try to find matching date, else fallback to newest (index 0)
        const matchedDateEntry = targetTypeArray.find(
          (d) => d.date === variable.date,
        );
        const targetDateEntry = matchedDateEntry || targetTypeArray[0];

        // 4. Resolve LESSON: Try to keep current lesson, else fallback to first available
        const targetLesson = targetDateEntry.types.includes(variable.lesson)
          ? variable.lesson
          : targetDateEntry.types[0];

        // 5. Construct URL preserving query parameters (?q=...&i=...)
        const url = buildURL(
          `/${newGeneration}/${targetType}/${targetDateEntry.date}/${targetLesson}`,
          {
            q: searchVar.q,
            i: searchVar.i,
          },
        );

        // 6. Execute navigation or prefetching
        if (method === "push") router.push(url);
        else if (method === "fetch") router.prefetch(url);
      }
    },
    [variable, searchVar.q, searchVar.i, router],
  );

  const routeType = useCallback(
    (newType: string, method = "push") => {
      if (variable.type !== newType) {
        const targetTypeArray = genData?.[newType as keyof typeof genData];
        if (!targetTypeArray || targetTypeArray.length === 0) return;

        // Step A: Attempt to preserve the current DATE
        const matchedDateEntry = targetTypeArray.find(
          (d) => d.date === variable.date,
        );
        const targetDateEntry = matchedDateEntry || targetTypeArray[0];

        // Step B: Attempt to preserve the current LESSON within that resolved date
        const targetLesson = targetDateEntry.types.includes(variable.lesson)
          ? variable.lesson
          : targetDateEntry.types[0];

        // Step C: Build and execute safe route
        const url = buildURL(
          `/${variable.generation}/${newType}/${targetDateEntry.date}/${targetLesson}`,
          {
            q: searchVar.q,
            i: searchVar.i,
          },
        );

        if (method === "push") router.push(url);
        else if (method === "fetch") router.prefetch(url);
      }
    },
    [variable, searchVar.q, searchVar.i, genData, router],
  );

  const routeDate = useCallback(
    (key: number, method = "push") => {
      const targetDateEntry = data[key];

      // Guard against out-of-bounds index or clicking the already active date
      if (targetDateEntry && targetDateEntry.date !== variable.date) {
        // Attempt to preserve the current LESSON; fallback to first lesson of the new date
        const targetLesson = targetDateEntry.types.includes(variable.lesson)
          ? variable.lesson
          : targetDateEntry.types[0];

        const url = buildURL(
          `/${variable.generation}/${variable.type}/${targetDateEntry.date}/${targetLesson}`,
          {
            q: searchVar.q,
            i: searchVar.i,
          },
        );

        if (method === "push") router.push(url);
        else if (method === "fetch") router.prefetch(url);
      }
    },
    [variable, searchVar.q, searchVar.i, data, router],
  );

  const routeLesson = useCallback(
    (newLesson: string, method = "push") => {
      const formattedLesson = newLesson.toLowerCase();

      if (variable.lesson !== formattedLesson) {
        // Find current active date object to validate lesson existence
        const currentDateEntry =
          data.find((d) => d.date === variable.date) || data[0];

        // Safety Guard: Ensure target lesson actually exists in this date's schedule
        if (
          !currentDateEntry ||
          !currentDateEntry.types.includes(formattedLesson)
        )
          return;

        const url = buildURL(
          `/${variable.generation}/${variable.type}/${variable.date}/${formattedLesson}`,
          {
            q: searchVar.q,
            i: searchVar.i,
          },
        );

        if (method === "push") router.push(url);
        else if (method === "fetch") router.prefetch(url);
      }
    },
    [variable, searchVar.q, searchVar.i, data, router],
  );

  return (
    <>
      <Menu>
        <Menu.Trigger
          as={Button}
          ripple={false}
          className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          {/* Cohort/Group Icon to represent Generation */}
          <svg
            className="me-2.5 h-3 w-3 scale-150 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="none"
            viewBox="0 0 19 19"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.333 6.333a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11.334 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM14 13v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2Zm2.5-3a3 3 0 0 1 1.5 2.6v.9a1.5 1.5 0 0 1-.765 1.341m-2.235-8.841a3 3 0 0 1 2.5 1.5"
            />
          </svg>

          <span className="uppercase">{variable.generation}</span>

          <svg
            className="ms-2.5 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 5"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </Menu.Trigger>
        <Menu.Content
          as="div"
          className="z-10 max-h-1/2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-800 divide-y divide-gray-100 overflow-y-auto rounded-lg border-none bg-white shadow-sm outline-none sm:max-h-3/4 dark:divide-gray-600 dark:bg-gray-800"
        >
          <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
            {Object.keys(json).map((genKey) => (
              <Menu.Item
                as="li"
                key={genKey}
                className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                /* eslint-disable react/jsx-no-bind */
                onMouseEnter={() => routeGeneration(genKey, "fetch")}
                onClick={() => routeGeneration(genKey, "push")}
              >
                <input
                  id={`gen-${genKey}`}
                  type="radio"
                  defaultValue=""
                  name="generation-radio"
                  checked={genKey === variable.generation}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                  readOnly
                />
                <label
                  htmlFor={`gen-${genKey}`}
                  className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 uppercase dark:text-white"
                >
                  {genKey}
                </label>
              </Menu.Item>
            ))}
          </ul>
        </Menu.Content>
      </Menu>
      <Menu>
        <Menu.Trigger
          as={Button}
          ripple={false}
          className="ml-2 inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            className="me-2.5 h-3 w-3 scale-150 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 22 22"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"
            />
          </svg>
          {getTypeName()}
          <svg
            className="ms-2.5 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 5"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </Menu.Trigger>
        <Menu.Content
          as="div"
          className="z-10 max-h-1/2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-800 divide-y divide-gray-100 overflow-y-auto rounded-lg border-none bg-white shadow-sm outline-none sm:max-h-3/4 dark:divide-gray-600 dark:bg-gray-800"
        >
          <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
            {Object.keys(genData).map((typeKey) => (
              <Menu.Item
                as="li"
                key={typeKey}
                className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onMouseEnter={() => routeType(typeKey, "fetch")}
                onClick={() => routeType(typeKey)}
              >
                <input
                  id="type-utbk"
                  type="radio"
                  defaultValue=""
                  name="date-radio"
                  checked={variable.type === typeKey}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                  readOnly
                />
                <label
                  htmlFor="type-utbk"
                  className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 dark:text-white"
                >
                  {getTypeName(typeKey)}
                </label>
              </Menu.Item>
            ))}
          </ul>
        </Menu.Content>
      </Menu>

      <Menu>
        <Menu.Trigger
          as={Button}
          ripple={false}
          className="ml-2 inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            className="me-3 h-3 w-3 scale-150 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="none"
            viewBox="0 0 21 21"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
            />
          </svg>
          {convertDateString(variable.date)}
          <svg
            className="ms-2.5 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 5"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </Menu.Trigger>
        <Menu.Content
          as="div"
          className="z-10 max-h-1/2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-800 divide-y divide-gray-100 overflow-y-auto rounded-lg border-none bg-white shadow-sm outline-none sm:max-h-3/4 dark:divide-gray-600 dark:bg-gray-800"
        >
          <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
            {data.map((result, key) => (
              <Menu.Item
                as="li"
                key={key}
                className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                /* eslint-disable react/jsx-no-bind */
                onMouseEnter={() => routeDate(key, "fetch")}
                onClick={() => routeDate(key)}
              >
                <input
                  id={`date-` + key}
                  type="radio"
                  defaultValue=""
                  name="date-radio"
                  checked={result.date === variable.date}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                  readOnly
                />
                <label
                  htmlFor={`date-` + key}
                  className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 dark:text-white"
                >
                  {convertDateString(result.date)}
                </label>
              </Menu.Item>
            ))}
          </ul>
        </Menu.Content>
      </Menu>

      <Menu>
        <Menu.Trigger
          as={Button}
          ripple={false}
          className="ml-2 inline-flex max-h-1/2 cursor-pointer scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-800 items-center overflow-y-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none sm:max-h-3/4 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            className="me-2.5 h-3 w-3 scale-150 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 22 22"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
            />
          </svg>
          {getLessonName()}
          <svg
            className="ms-2.5 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 5"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </Menu.Trigger>
        <Menu.Content
          as="div"
          className="z-10 divide-y divide-gray-100 rounded-lg border-none bg-white shadow-sm outline-none dark:divide-gray-600 dark:bg-gray-800"
        >
          <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
            {data
              .find((result) => result.date === variable.date)
              ?.types.map((lesson, key) => (
                <Menu.Item
                  as="li"
                  key={key}
                  className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onMouseEnter={() => routeLesson(lesson, "fetch")}
                  onClick={() => routeLesson(lesson)}
                >
                  <input
                    id={`type-` + key}
                    type="radio"
                    defaultValue=""
                    name="type-radio"
                    checked={variable.lesson === lesson}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                    readOnly
                  />
                  <label
                    htmlFor={`type-` + key}
                    className="ms-2 w-full cursor-pointer rounded-sm text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {getLessonName(lesson)}
                  </label>
                </Menu.Item>
              ))}
          </ul>
        </Menu.Content>
      </Menu>
    </>
  );
}
