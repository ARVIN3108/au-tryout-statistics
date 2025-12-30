import NavigationButton from "@/components/clients/NavigationButton";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid h-screen min-h-full place-items-center overflow-y-auto bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-[rgba(16,24,40,0.7)]">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
          404
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-200">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
          >
            Kembali ke Beranda
          </Link>
          <NavigationButton
            action="back"
            className="cursor-pointer rounded-md border-gray-900 px-3.5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border dark:border-white dark:text-white hover:dark:bg-white hover:dark:text-gray-900 dark:focus-visible:outline-white"
          >
            Kembali ke halaman sebelumnya <span aria-hidden="true">&rarr;</span>
          </NavigationButton>
        </div>
      </div>
    </main>
  );
}
