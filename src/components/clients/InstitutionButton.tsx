"use client";

import { Menu, Button } from "@material-tailwind/react";
import { useRouter, usePathname } from "next/navigation";
import { buildURL, toArrayOfString } from "@/utils";

export default function InstitutionButton({
  institutions,
  searchVar,
}: {
  institutions: string[];
  searchVar: { [key: string]: string | string[] | undefined };
}) {
  const pathname = usePathname();
  const route = useRouter();
  const query = toArrayOfString(searchVar.i).filter((i) =>
    institutions.includes(i),
  );

  function toggleInstitutions(ins: string) {
    const i = query.indexOf(ins);

    const result = [...query];

    if (i > -1) result.splice(i, 1);
    else result.push(ins);

    return result;
  }

  return (
    <Menu>
      <Menu.Trigger
        as={Button}
        ripple={false}
        className="mr-2 inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
      >
        <svg
          className="me-3 h-3 w-3 scale-160 text-gray-500 dark:text-gray-400"
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
            d="M8.14294 20v-9l-4 1.125V20h4Zm0 0V6.66667m0 13.33333h2.99996m5-9V6.66667m0 4.33333 4 1.125V13m-4-2v3m2-6-6-4-5.99996 4m4.99996 1h2m-2 3h2m1 6 2 2 4-4"
          />
        </svg>
        Filter Lembaga{" "}
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
        className="z-10 w-55 divide-y divide-gray-100 rounded-lg border-none bg-white shadow-sm outline-none dark:divide-gray-600 dark:bg-gray-800"
      >
        <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
          {institutions.sort().map((str, key) => (
            <Menu.Item
              as="li"
              key={key}
              closeOnClick={false}
              className="flex cursor-pointer items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              // eslint-disable-next-line react/jsx-no-bind
              onChange={() => {
                const url = buildURL(pathname, {
                  q: searchVar.q,
                  i: toggleInstitutions(str),
                });
                route.push(url);
              }}
              ripple={false}
            >
              <input
                id={`checkbox-item-` + key}
                type="checkbox"
                checked={query.includes(str)}
                className="h-4 w-4 cursor-pointer rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                readOnly
              />
              <label
                htmlFor={`checkbox-item-` + key}
                className="ms-2 w-full cursor-pointer rounded-sm text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {str?.toUpperCase()}
              </label>
            </Menu.Item>
          ))}
        </ul>
      </Menu.Content>
    </Menu>
  );
}
