"use client";

import { buildURL, debounce, DebounceFunction, toArrayOfString } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function SearchInput({
  searchVar,
  institutions,
}: {
  searchVar: { [key: string]: string | string[] | undefined };
  institutions: string[];
}) {
  const route = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchVar.q);

  // The debounced search function. We wrap it in `useCallback` to prevent
  // it from being re-created on every render, which is crucial for
  // the debounce timer to work correctly.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    (debounce as DebounceFunction)((url: string) => {
      route.push(url);
    }, 275),
    [],
  );

  return (
    <input
      type="text"
      id="table-search"
      className="block w-60 rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      placeholder="Cari Nama Siswa / No. Peserta"
      value={searchTerm}
      onChange={(e) => {
        const searchTerm = e.target.value;
        const url = buildURL(pathname, {
          q: searchTerm,
          i: toArrayOfString(searchVar.i).filter((i) =>
            institutions.includes(i),
          ),
        });
        setSearchTerm(searchTerm);
        debouncedSearch(url);
      }}
    />
  );
}
