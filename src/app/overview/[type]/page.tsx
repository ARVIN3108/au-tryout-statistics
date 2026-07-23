import { notFound } from "next/navigation";
import json from "../../../../date.json";
import * as path from "path";
import readXlsxFile, { CellValue, Row } from "read-excel-file/node";
import LeftMenuOverview from "@/components/clients/LeftMenuOverview";
import { group } from "console";

type Props = Readonly<{
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>;

export default async function Page({ params, searchParams }: Props) {
  const variable = await params;
  const searchVar = await searchParams;

  if (!(variable.type in json)) notFound();

  const date = json[variable.type as keyof typeof json];

  const data: { [key: string]: Row[] | (CellValue | null)[] | Row[][] } = {};

  function filePathGen(date: string, lesson: string) {
    return path.join(
      process.cwd(),
      "src",
      "assets",
      "data",
      variable.type,
      date,
      lesson + ".xlsx",
    );
  }

  try {
    const promises = date.map(async (result) => {
      const excel = await readXlsxFile(
        filePathGen(result.date, result.types[0]),
      );
      return excel;
    });

    data.tryouts = await Promise.all(promises);
  } catch (err) {
    console.error("Error reading the Excel file:", err);
    throw err;
  }

  if (typeof searchVar.q === "string" && searchVar.q.trim().length > 0)
    data.tryouts = data.tryouts
      .map((rows) =>
        rows.filter(
          (column) =>
            column[1]?.toString().toLowerCase() ==
            `${searchVar.q}`.toLowerCase(),
        ),
      )
      .filter((group) => group.length > 0);

  console.log(data.tryouts);

  // const getSafeRoundedValue = (
  //   dataArray: any[][] | undefined | null,
  //   colIdx: number,
  // ): number | null => {
  //   // 1. Check if the outer array and the specific row exist
  //   const row = dataArray?.[0];
  //   if (!row) return null;

  //   // 2. Extract the raw value
  //   const rawValue = row[colIdx];

  //   // 3. Handle null/undefined values immediately
  //   if (rawValue === null || rawValue === undefined || rawValue === "") {
  //     return null;
  //   }

  //   // 4. Parse and validate the number
  //   const parsed = parseFloat(String(rawValue));

  //   // 5. Check if parsing resulted in a valid number (not NaN)
  //   return isNaN(parsed) ? null : Math.round(parsed);
  // };

  return (
    <div className="px-2 py-4">
      <div className="flex flex-col flex-wrap items-center justify-between space-y-4 pb-4 lg:flex-row lg:space-y-0">
        <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <LeftMenuOverview variable={variable} searchVar={searchVar} />
        </div>
        <label htmlFor="table-search" className="sr-only"></label>
        <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="relative">
            <div className="rtl:inset-r-0 pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3 rtl:right-0">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* <SearchInput
              searchVar={searchVar}
              institutions={data.institutions as string[]}
            /> */}
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        {!searchVar.q && (
          <p className="w-full rounded-lg bg-gray-50 p-3 text-center text-sm font-bold text-gray-700 opacity-90 dark:bg-gray-800 dark:text-gray-300">
            Silahkan masukkan No. Peserta / Nama Lengkap Siswa pada kolom
            pencarian di pojok kanan atas.
          </p>
        )}
        {/* {variable.type == "utbk"
          ? (variable.lesson == "irt" && <UTBKIRTTable data={data.tryout} />) ||
            (variable.lesson == "real" && <UTBKRealTable data={data.tryout} />)
          : variable.type == "tka"
            ? variable.date == json.tka[json.tka.length - 1].date
              ? (variable.lesson == "saintek" && (
                  <SAINTEKOldTable data={data.tryout} />
                )) ||
                (variable.lesson == "soshum" && (
                  <SOSHUMWithAverageTable data={data.tryout} />
                ))
              : (variable.lesson == "saintek" &&
                  (compatibility.tka.includes("CIVICS") ? (
                    <SAINTEKWithCivicsTable data={data.tryout} />
                  ) : compatibility.tka.includes("AVERAGE") ? (
                    <SAINTEKWithAverageTable data={data.tryout} />
                  ) : (
                    <SAINTEKTable data={data.tryout} />
                  ))) ||
                (variable.lesson == "soshum" &&
                  (compatibility.tka.includes("CIVICS") ? (
                    <SOSHUMWithCivicsTable data={data.tryout} />
                  ) : compatibility.tka.includes("AVERAGE") ? (
                    <SOSHUMWithAverageTable data={data.tryout} />
                  ) : (
                    <SOSHUMTable data={data.tryout} />
                  ))) ||
                (variable.lesson == "khos" &&
                  (compatibility.tka.includes("AVERAGE") ? (
                    <KHOSWithAverageTable data={data.tryout} />
                  ) : (
                    <KHOSTable data={data.tryout} />
                  ))) ||
                (variable.lesson == "tka" && <TKATable data={data.tryout} />)
            : (variable.lesson == "toefl" && (
                <TOEFLTable data={data.tryout} />
              )) ||
              (variable.lesson == "toafl" && <TOAFLTable data={data.tryout} />)} */}
      </div>
    </div>
  );
}
