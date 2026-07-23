import { notFound } from "next/navigation";
import json from "../../../../../date.json";
import * as path from "path";
import { readSheet, CellValue, Row } from "read-excel-file/node";
import SAINTEKOldTable from "@/components/tables/SAINTEKOldTable";
import SAINTEKTable from "@/components/tables/SAINTEKTable";
import SAINTEKWithAverageTable from "@/components/tables/SAINTEKWithAverageTable";
import SAINTEKWithCivicsTable from "@/components/tables/SAINTEKWithCivicsTable";
import SOSHUMTable from "@/components/tables/SOSHUMTable";
import SOSHUMWithAverageTable from "@/components/tables/SOSHUMWithAverageTable";
import SOSHUMWithCivicsTable from "@/components/tables/SOSHUMWithCivicsTable";
import KHOSTable from "@/components/tables/KHOSTable";
import KHOSWithAverageTable from "@/components/tables/KHOSWithAverageTable";
import TKATable from "@/components/tables/TKATable";
import UTBKIRTTable from "@/components/tables/UTBKIRTTable";
import UTBKRealTable from "@/components/tables/UTBKRealTable";
import UTBKRealWithMinusTable from "@/components/tables/UTBKRealWithMinusTable";
import TOEFLTable from "@/components/tables/TOEFLTable";
import TOAFLTable from "@/components/tables/TOAFLTable";
import LeftMenu from "@/components/clients/LeftMenu";
import SearchInput from "@/components/clients/SearchInput";
import InstitutionButton from "@/components/clients/InstitutionButton";
import { formatTKAIdString, toArrayOfString } from "@/utils";
import UTBKExternalRealWithMinusTable from "@/components/tables/UTBKExternalRealWithMinusTable";

type Props = Readonly<{
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>;

export async function generateMetadata({ params }: Props) {
  const lesson = (await params).lesson;
  if (lesson == "tka")
    return {
      title: "Hasil Tes Kemampuan Akademik Amanatul Ummah",
    };
}

export default async function Page({ params, searchParams }: Props) {
  const variable = await params;
  const searchVar = await searchParams;

  if (!(variable.type in json)) notFound();

  const date = json[variable.type as keyof typeof json]?.find(
    (d) => d.date === variable.date,
  );
  if (!date || !date.types.includes(variable.lesson)) notFound();

  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "data",
    variable.type,
    variable.date,
    variable.lesson + ".xlsx",
  );

  const data: { [key: string]: Row[] | (CellValue | null)[] } = {};

  // function filePathGen(date: string, lesson = "irt") {
  //   return path.join(
  //     process.cwd(),
  //     "src",
  //     "assets",
  //     "data",
  //     variable.type,
  //     date,
  //     lesson + ".xlsx",
  //   );
  // }

  const getSafeRoundedValue = (
    dataArray: any[][] | undefined | null,
    colIdx: number,
  ): number | null => {
    // 1. Check if the outer array and the specific row exist
    const row = dataArray?.[0];
    if (!row) return null;

    // 2. Extract the raw value
    const rawValue = row[colIdx];

    // 3. Handle null/undefined values immediately
    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return null;
    }

    // 4. Parse and validate the number
    const parsed = parseFloat(String(rawValue));

    // 5. Check if parsing resulted in a valid number (not NaN)
    return isNaN(parsed) ? null : Math.round(parsed);
  };

  try {
    const cachedData = await readSheet(filePath);
    data.tryout = cachedData;
    // data.tryoutA = await readSheet(filePathGen("18-1-26"));
    // data.tryoutB = await readSheet(filePathGen("1-3-26"));
    // data.tryoutC = await readSheet(filePathGen("7-3-26"));
    const institutions = cachedData.map((s) => s[s.length - 1]);
    data.institutions = [...new Set(institutions)];
  } catch (err) {
    console.error("Error reading the Excel file:", err);
    throw err;
  }

  const compatibility = {
    utbk: json.utbk.find((s) => s.date == variable.date)?.compatibility || [],
    tka: json.tka.find((s) => s.date == variable.date)?.compatibility || [],
  };

  const institutions = toArrayOfString(searchVar.i);
  if (institutions.length != 0) {
    const filteredTryout = data.tryout.filter((student) =>
      institutions.includes(student[student.length - 1] as string),
    );
    if (filteredTryout.length != 0) data.tryout = filteredTryout;
    searchVar.i = institutions.filter((i) =>
      (data.institutions as string[]).includes(i),
    );
  }

  function filterTO(data: Row[]) {
    return data.filter(
      (student) =>
        student[2]
          ?.toString()
          .toLowerCase()
          .includes(`${searchVar.q}`.toLowerCase()) ||
        student[1]?.toString().toLowerCase() == `${searchVar.q}`.toLowerCase(),
    );
  }

  if (typeof searchVar.q === "string" && searchVar.q.trim().length > 0) {
    // data.tryoutA = filterTO(data.tryoutA);
    // data.tryoutB = filterTO(data.tryoutB);
    // data.tryoutC = filterTO(data.tryoutC);
    // data.tryoutD = filterTO(data.tryoutD);
    // data.tryoutE = filterTO(data.tryoutE);
    // data.tryoutF = filterTO(data.tryoutF);
    // data.tryoutG = filterTO(data.tryoutG);
    data.tryout = data.tryout.filter((student) =>
      variable.lesson == "tka"
        ? student[1]
            ?.toString()
            .toLowerCase()
            .includes(`${searchVar.q}`.toLowerCase()) ||
          student[0]?.toString().toLowerCase() ==
            `${searchVar.q}`.toLowerCase() ||
          formatTKAIdString(student[0]?.toString().toLowerCase() ?? "") ==
            `${searchVar.q}`.toLowerCase()
        : student[2]
            ?.toString()
            .toLowerCase()
            .includes(`${searchVar.q}`.toLowerCase()) ||
          student[1]?.toString().toLowerCase() ==
            `${searchVar.q}`.toLowerCase(),
    );
  }

  return (
    <div className="px-2 py-4">
      <div className="flex flex-col flex-wrap items-center justify-between space-y-4 pb-4 lg:flex-row lg:space-y-0">
        <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <LeftMenu
            variable={variable}
            searchVar={searchVar}
            compatibility={compatibility}
          />
        </div>
        <label htmlFor="table-search" className="sr-only"></label>
        <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          {variable.lesson != "tka" && variable.lesson != "external" && (
            <InstitutionButton
              institutions={data.institutions as string[]}
              searchVar={searchVar}
            />
          )}
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
            <SearchInput
              searchVar={searchVar}
              institutions={data.institutions as string[]}
            />
          </div>
        </div>
      </div>
      <div className="bg-amber-200">
        {/* <span>18-1-26 (IRT): {getSafeRoundedValue(data.tryoutA, 11)}</span>
        <br />
        <span>1-3-26 (IRT): {getSafeRoundedValue(data.tryoutB, 11)}</span>
        <br />
        <span>7-3-26 (IRT): {getSafeRoundedValue(data.tryoutC, 11)}</span> */}
        {/*<br />
        <span>
          18-1-26 (Real):{" "}
          {Math.round(parseFloat(data.tryoutC[0][11] as string))}
        </span>
        <br />
        <span>25-1-26 (IRT): {getSafeRoundedValue(data.tryoutE, 11)}</span>
        <br />
        <span>1-2-26 (IRT): {getSafeRoundedValue(data.tryoutF, 11)}</span>
        <br />
        <span>22-2-26 (IRT): {getSafeRoundedValue(data.tryoutG, 11)}</span> */}
      </div>
      <div className="relative overflow-x-auto">
        {data.tryout.length != 0 ? (
          variable.type == "utbk" ? (
            compatibility.utbk.includes("EXTERNAL") ? (
              (variable.lesson == "irt" && (
                <UTBKIRTTable data={data.tryout} />
              )) ||
              ((variable.lesson == "real" || variable.lesson == "mix") && (
                <UTBKRealWithMinusTable
                  data={data.tryout}
                  mix={variable.lesson == "mix"}
                />
              )) ||
              (variable.lesson == "external" && (
                <UTBKExternalRealWithMinusTable data={data.tryout} />
              ))
            ) : (
              (variable.lesson == "irt" && (
                <UTBKIRTTable data={data.tryout} />
              )) ||
              (variable.lesson == "real" && (
                <UTBKRealTable data={data.tryout} />
              ))
            )
          ) : variable.type == "tka" ? (
            variable.date == json.tka[json.tka.length - 1].date ? (
              (variable.lesson == "saintek" && (
                <SAINTEKOldTable data={data.tryout} />
              )) ||
              (variable.lesson == "soshum" && (
                <SOSHUMWithAverageTable data={data.tryout} />
              ))
            ) : (
              (variable.lesson == "saintek" &&
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
            )
          ) : (
            (variable.lesson == "toefl" && <TOEFLTable data={data.tryout} />) ||
            (variable.lesson == "toafl" && <TOAFLTable data={data.tryout} />)
          )
        ) : (
          <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gray-50 px-4 py-8 text-center text-sm font-bold text-gray-700 opacity-90 dark:bg-gray-800 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="h-12 w-12 text-black dark:text-white"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-black dark:text-white">
              Peserta Try Out tidak dapat ditemukan
            </h3>
            <p className="mt-2">
              Maaf, hasil peserta tryout yang kamu cari tidak dapat ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
