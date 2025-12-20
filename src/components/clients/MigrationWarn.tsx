"use client";
import Link from "next/link";
import { useState } from "react";

export default function MigrationWarn() {
  const [isActive, setActive] = useState(false);

  return (
    <div
      className={`${isActive && "animate-fadeOut"} sticky start-0 top-0 z-1 mb-4 flex w-full items-center border-t bg-blue-50 p-3 text-blue-900 opacity-90 dark:bg-blue-950 dark:text-blue-400`}
      role="alert"
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 md:mt-0"
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
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <span className="sr-only">Info</span>
      <div className="ms-3 text-sm font-medium">
        Website ini menggunakan framework baru yakni{" "}
        <Link
          className="underline hover:text-black hover:no-underline dark:hover:text-white"
          href="https://nextjs.org/"
        >
          Next.js
        </Link>
        . Jika kamu merasakan lag atau bug, silakan kembali ke website yang
        lama.
        <Link
          href="https://arvindt.is-a.dev/hasiltryoutakbar"
          className="ml-1 inline-flex items-center text-sm font-medium text-black hover:underline md:ml-1 dark:text-white"
        >
          Klik disini
          <svg
            className="ml-1.5 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            ></path>
          </svg>
        </Link>
      </div>
      <button
        type="button"
        className="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-1.5 hover:bg-blue-200 focus:bg-blue-900 focus:ring-2 dark:hover:bg-blue-900 dark:focus:ring-blue-200"
        aria-label="Close"
        onClick={() => setActive(true)}
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}
