"use client";

import { Menu, Button } from "@material-tailwind/react";
import json from "../../../date.json";
import { useRouter } from "next/navigation";
import { buildURL, convertDateString, isLessonAvailable } from "@/utils";
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
  const data = json[variable.type as keyof typeof json];

  const routeType = useCallback(
    (type: string, method = "push") => {
      if (variable.type != type) {
        const jsonType = json[type as keyof typeof json][0];
        const url = buildURL(`/${type}/${jsonType.date}/${jsonType.types[0]}`, {
          q: searchVar.q,
          i: searchVar.i,
        });
        if (method == "push") router.push(url);
        else if (method == "fetch") router.prefetch(url);
      }
    },
    [variable.type, searchVar.q, searchVar.i, router],
  );

  const routeDate = useCallback(
    (key: number, method = "push") => {
      if (data[key].date != variable.date) {
        const url = buildURL(
          `/${variable.type}/${data[key].date}/${isLessonAvailable(data[key].types[0], variable.lesson)}`,
          {
            q: searchVar.q,
            i: searchVar.i,
          },
        );
        if (method == "push") router.push(url);
        else if (method == "fetch") router.prefetch(url);
      }
    },
    [variable, searchVar.q, searchVar.i, data, router],
  );

  const routeLesson = useCallback(
    (lesson: string, method = "push") => {
      if (variable.lesson != lesson.toLowerCase()) {
        const url = buildURL(
          `/${variable.type}/${variable.date}/${lesson.toLowerCase()}`,
          {
            q: searchVar.q,
            i: searchVar.i,
          },
        );
        if (method == "push") router.push(url);
        else if (method == "fetch") router.prefetch(url);
      }
    },
    [variable, searchVar.q, searchVar.i, router],
  );

  return (
    <>
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
          {(variable.type == "utbk" && "SNBT - UTBK") ||
            (variable.type == "tka" && "SNBP - TKA") ||
            "TOEFL - TOAFL"}
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
            <Menu.Item
              as="li"
              className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onMouseEnter={useCallback(
                () => routeType("utbk", "fetch"),
                [routeType],
              )}
              onClick={useCallback(() => routeType("utbk"), [routeType])}
            >
              <input
                id="type-utbk"
                type="radio"
                defaultValue=""
                name="date-radio"
                checked={variable.type == "utbk"}
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                readOnly
              />
              <label
                htmlFor="type-utbk"
                className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 dark:text-white"
              >
                SNBT - UTBK
              </label>
            </Menu.Item>
            <Menu.Item
              as="li"
              className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onMouseEnter={useCallback(
                () => routeType("tka", "fetch"),
                [routeType],
              )}
              onClick={useCallback(() => routeType("tka"), [routeType])}
            >
              <input
                id="type-tka"
                type="radio"
                defaultValue=""
                name="date-radio"
                checked={variable.type == "tka"}
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                readOnly
              />
              <label
                htmlFor="type-tka"
                className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 dark:text-white"
              >
                SNBP - TKA
              </label>
            </Menu.Item>
            <Menu.Item
              as="li"
              className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onMouseEnter={useCallback(
                () => routeType("toefl", "fetch"),
                [routeType],
              )}
              onClick={useCallback(() => routeType("toefl"), [routeType])}
            >
              <input
                id="type-toefl"
                type="radio"
                defaultValue=""
                name="date-radio"
                checked={variable.type == "toefl"}
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                readOnly
              />
              <label
                htmlFor="type-toefl"
                className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 dark:text-white"
              >
                TOEFL - TOAFL
              </label>
            </Menu.Item>
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
          className="z-10 divide-y divide-gray-100 rounded-lg border-none bg-white shadow-sm outline-none dark:divide-gray-600 dark:bg-gray-800"
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
                  checked={data[key].date == variable.date}
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
              d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
            />
          </svg>
          {compatibility.utbk.includes("EXTERNAL")
            ? (variable.lesson.toLowerCase() == "real" &&
                "ASLI / " +
                  variable.lesson.toUpperCase() +
                  " (AMANATUL UMMAH SAJA)") ||
              (variable.lesson.toLowerCase() == "external" &&
                "ASLI / REAL (" + variable.lesson.toUpperCase() + " SAJA)") ||
              (variable.lesson.toLowerCase() == "mix" &&
                "ASLI / REAL (AMANATUL UMMAH + EXTERNAL)") ||
              variable.lesson.toUpperCase() + " (AMANATUL UMMAH SAJA)"
            : variable.lesson.toLowerCase() == "real"
              ? "ASLI / " + variable.lesson.toUpperCase()
              : variable.lesson.toLowerCase() == "toafl"
                ? variable.lesson.toUpperCase() + " / KHOS"
                : variable.lesson.toUpperCase()}
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
              .find((result) => result.date == variable.date)
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
                    checked={variable.lesson == lesson}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                    readOnly
                  />
                  <label
                    htmlFor={`type-` + key}
                    className="ms-2 w-full cursor-pointer rounded-sm text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {compatibility.utbk.includes("EXTERNAL")
                      ? (lesson.toLowerCase() == "real" &&
                          "ASLI / " +
                            lesson.toUpperCase() +
                            " (AMANATUL UMMAH SAJA)") ||
                        (lesson.toLowerCase() == "external" &&
                          "ASLI / REAL (" + lesson.toUpperCase() + " SAJA)") ||
                        (lesson.toLowerCase() == "mix" &&
                          "ASLI / REAL (AMANATUL UMMAH + EXTERNAL)") ||
                        lesson.toUpperCase() + " (AMANATUL UMMAH SAJA)"
                      : lesson.toLowerCase() == "real"
                        ? "ASLI / " + lesson.toUpperCase()
                        : lesson.toLowerCase() == "toafl"
                          ? lesson.toUpperCase() + " / KHOS"
                          : lesson.toUpperCase()}
                  </label>
                </Menu.Item>
              ))}
          </ul>
        </Menu.Content>
      </Menu>
    </>
  );
}
