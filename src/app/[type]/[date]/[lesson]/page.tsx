import { notFound } from "next/navigation";
import json from "../../../../../date.json";
import * as path from "path";
import readXlsxFile, { CellValue, Row } from "read-excel-file/node";
import SAINTEKOldTable from "@/components/tables/SAINTEKOldTable";
import SAINTEKTable from "@/components/tables/SAINTEKTable";
import SAINTEKWithAverageTable from "@/components/tables/SAINTEKWithAverageTable";
import SAINTEKWithCivicsTable from "@/components/tables/SAINTEKWithCivicsTable";
import SOSHUMTable from "@/components/tables/SOSHUMTable";
import SOSHUMWithAverageTable from "@/components/tables/SOSHUMWithAverageTable";
import SOSHUMWithCivicsTable from "@/components/tables/SOSHUMWithCivicsTable";
import KHOSTable from "@/components/tables/KHOSTable";
import KHOSWithAverageTable from "@/components/tables/KHOSWithAverageTable";
import UTBKIRTTable from "@/components/tables/UTBKIRTTable";
import UTBKRealTable from "@/components/tables/UTBKRealTable";
import LeftMenu from "@/components/clients/LeftMenu";
import SearchInput from "@/components/clients/SearchInput";
import InstitutionButton from "@/components/clients/InstitutionButton";
import { formatTKAIdString, toArrayOfString } from "@/utils";
import TOEFLTable from "@/components/tables/TOEFLTable";
import TOAFLTable from "@/components/tables/TOAFLTable";
import TKATable from "@/components/tables/TKATable";

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

  if (variable.type == "utbk") {
    const data = json.utbk.find((d) => d.date == variable.date);
    if (data == undefined || !data.types.includes(variable.lesson)) notFound();
  } else if (variable.type == "tka") {
    const data = json.tka.find((d) => d.date == variable.date);
    if (data == undefined || !data.types.includes(variable.lesson)) notFound();
  } else if (variable.type == "toefl") {
    const data = json.toefl.find((d) => d.date == variable.date);
    if (data == undefined || !data.types.includes(variable.lesson)) notFound();
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "data",
    variable.type,
    variable.date,
    variable.lesson + ".xlsx",
  );

  const data: { [key: string]: Row[] | CellValue[] } = {
    default: [],
    institutions: [],
  };

  try {
    const cachedData = await readXlsxFile(filePath);
    data.tryout = cachedData;
    const institutions = cachedData.map((s) => s[s.length - 1]);
    data.institutions = [...new Set(institutions)];
  } catch (err) {
    console.error("Error reading the Excel file:", err);
    throw err;
  }

  const compatibility: { [key: string]: string[] } = {
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

  if (typeof searchVar.q === "string" && searchVar.q.trim().length > 0)
    data.tryout = data.tryout.filter((student) =>
      variable.lesson == "tka"
        ? student[1]
            ?.toString()
            .toLowerCase()
            .includes(`${searchVar.q}`.toLowerCase()) ||
          student[0]?.toString().toLowerCase() ==
            `${searchVar.q}`.toLowerCase() ||
          formatTKAIdString(student[0]?.toString().toLowerCase()) ==
            `${searchVar.q}`.toLowerCase()
        : student[2]
            ?.toString()
            .toLowerCase()
            .includes(`${searchVar.q}`.toLowerCase()) ||
          student[1]?.toString().toLowerCase() ==
            `${searchVar.q}`.toLowerCase(),
    );

  return (
    <div className="px-2 py-4">
      <div className="flex flex-col flex-wrap items-center justify-between space-y-4 pb-4 lg:flex-row lg:space-y-0">
        <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <LeftMenu variable={variable} searchVar={searchVar} />
        </div>
        <label htmlFor="table-search" className="sr-only"></label>
        <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          {variable.lesson != "tka" && (
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
      <div className="relative overflow-x-auto">
        {variable.type == "utbk"
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
              (variable.lesson == "toafl" && <TOAFLTable data={data.tryout} />)}
      </div>
    </div>
  );
}
