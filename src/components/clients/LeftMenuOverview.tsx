"use client";

import { Menu, Button } from "@material-tailwind/react";
import json from "../../../date.json";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { buildURL } from "@/utils";

export default function LeftMenuOverview({
  variable,
  searchVar,
}: {
  variable: { [key: string]: string };
  searchVar: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  // const data = json[variable.type as keyof typeof json];

  const routeType = useCallback(
    (type: string, method = "push") => {
      if (variable.type != type) {
        const url = buildURL(`/overview/${type}`, {
          q: searchVar.q,
        });
        if (method == "push") router.push(url);
        else if (method == "fetch") router.prefetch(url);
      }
    },
    [variable.type, searchVar.q, router],
  );

  const routeNormal = useCallback(
    (method = "push") => {
      const jsonType = json[variable.type as keyof typeof json][0];
      const url = buildURL(
        `/${variable.type}/${jsonType.date}/${jsonType.types[0]}`,
        {
          q: searchVar.q,
        },
      );
      if (method == "push") router.push(url);
      else if (method == "fetch") router.prefetch(url);
    },
    [variable.type, searchVar.q, router],
  );

  return (
    <>
      <Menu>
        <Menu.Trigger
          as={Button}
          ripple={false}
          className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            className="me-2 h-3.5 w-3.5 scale-150 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"
            />
          </svg>
          Mode: Overview
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
                () => routeNormal("fetch"),
                [routeNormal],
              )}
              onClick={useCallback(() => routeNormal(), [routeNormal])}
            >
              <input
                id="mode-normal"
                type="radio"
                defaultValue=""
                name="date-radio"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                readOnly
              />
              <label
                htmlFor="mode-normal"
                className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 dark:text-white"
              >
                <div className="mb-0.5">Mode: Normal</div>
                <p className="text-xs text-gray-400">
                  Mode standar yang menjadi <br />
                  mode default dari website ini.
                </p>
              </label>
            </Menu.Item>
            <Menu.Item
              as="li"
              className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <input
                id="mode-overview"
                type="radio"
                defaultValue=""
                name="date-radio"
                checked={true}
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                readOnly
              />
              <label
                htmlFor="mode-overview"
                className="ms-2 w-full cursor-pointer rounded-sm text-left text-sm font-medium text-gray-900 dark:text-white"
              >
                <div className="mb-0.5">
                  Mode: Overview
                  <span className="ms-2 rounded-md border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    Beta
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Mode standar yang menjadi <br />
                  mode default dari website ini.
                </p>
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
    </>
  );
}
