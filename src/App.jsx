import { Button, Menu } from "@material-tailwind/react";
import { base } from "../config";
import date from "./date.json";
import { useState, useEffect, useCallback } from "react";
import readXlsxFile from "read-excel-file";
import SAINTEKOldTable from "./tables/SAINTEKOldTable";
import SAINTEKTable from "./tables/SAINTEKTable";
import SAINTEKWithAverageTable from "./tables/SAINTEKWithAverageTable";
import SAINTEKWithCivicsTable from "./tables/SAINTEKWithCivicsTable";
import SOSHUMTable from "./tables/SOSHUMTable";
import SOSHUMWithAverageTable from "./tables/SOSHUMWithAverageTable";
import SOSHUMWithCivicsTable from "./tables/SOSHUMWithCivicsTable";
import KHOSTable from "./tables/KHOSTable";
import KHOSWithAverageTable from "./tables/KHOSWithAverageTable";
import UTBKIRTTable from "./tables/UTBKIRTTable";
import UTBKRealTable from "./tables/UTBKRealTable";

// A utility function to delay the execution of a function.
// This prevents the search logic from running on every keystroke,
// improving performance, especially with large datasets.
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function convertDateString(dateString) {
  // Split the input string into day, month, and year parts
  const parts = dateString.split("-");
  const day = parseInt(parts[0], 10);
  // Months are 0-indexed in JavaScript, so subtract 1
  const month = parseInt(parts[1], 10) - 1;
  // Convert two-digit year to a four-digit year (e.g., 25 -> 2025)
  const year = 2000 + parseInt(parts[2], 10);

  // Create a new Date object
  const date = new Date(year, month, day);

  // Use Intl.DateTimeFormat for locale-aware formatting
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("id-ID", options).format(date);
}

export default function App() {
  const [dataType, setDataType] = useState("utbk");
  const [data, setData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJSON, setSelectedJSON] = useState(date[dataType][0]);
  const [selectedType, setSelectedType] = useState(0);

  // The path is relative to the `public` folder
  function changeData(json, valType, newData) {
    setSearchTerm("");
    setSelectedJSON(json);
    if (!json.types[valType]) valType = 0;
    setSelectedType(valType);
    readData(base + `data/${newData}/${json.date}/${json.types[valType]}.xlsx`);
  }

  function toggleSchools(sch) {
    if (!schools.includes(sch)) return;

    const i = selectedSchools.indexOf(sch);

    let result = [...selectedSchools];

    if (i > -1) result.splice(i, 1);
    else result.push(sch);

    setSelectedSchools(result);

    if (result.length != 0) {
      const newData = data.filter((student) =>
        result.includes(student[student.length - 1]),
      );
      setSearchTerm("");
      setFilteredData(newData);
      setSchoolData(newData);
    } else {
      setSearchTerm("");
      setFilteredData(data);
      setSchoolData(data);
    }
  }

  function readData(filePath) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");

        return response.blob();
      })
      .then((blob) => readXlsxFile(blob))
      .then((rows) => {
        setData(rows);
        setSchoolData(rows);
        setFilteredData(rows);
        const allSchools = rows.map((s) => s[s.length - 1]);
        setSchools([...new Set(allSchools)]);
        setSelectedSchools([]);
      })
      .catch((err) => {
        setData([]);
        setSchoolData([]);
        setFilteredData([]);
        setSchools([]);
        setSelectedSchools([]);
        console.error("Error reading the Excel file:", err);
      });
  }

  useEffect(() => {
    readData(
      base +
        `data/${dataType}/${selectedJSON.date}/${selectedJSON.types[selectedType]}.xlsx`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array ensures this effect runs only once

  // The debounced search function. We wrap it in `useCallback` to prevent
  // it from being re-created on every render, which is crucial for
  // the debounce timer to work correctly.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((newSearchTerm) => {
      // If the search bar is empty, show all data.
      if (!newSearchTerm) setFilteredData(schoolData);
      else {
        // Filter the data based on the search term.
        // Assuming column indices: 2 (Nama Siswa), 1 (No. Peserta), and 18 (Lembaga).
        const newData = schoolData.filter(
          (student) =>
            student[2]?.toString().toLowerCase().includes(newSearchTerm) ||
            student[1]?.toString() == newSearchTerm,
        );
        setFilteredData(newData);
      }
    }, 300), // 300ms delay. Adjust as needed.
    [schoolData], // Recreate the debounced function if the `schoolData` state changes.
  );

  // The onChange handler for the input field.
  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    // Call the debounced function with the lowercase search term.
    debouncedSearch(newSearchTerm.toLowerCase());
  };

  return (
    <div className="h-screen overflow-y-auto bg-[url(assets/bg.png)] bg-cover bg-center bg-no-repeat antialiased bg-blend-multiply">
      <div className="relative grid min-h-screen grid-rows-[1fr_auto]">
        <div className="overflow-x-auto px-2 py-4">
          <div className="flex flex-col flex-wrap items-center justify-between space-y-4 pb-4 lg:flex-row lg:space-y-0">
            <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <Menu>
                <Menu.Trigger
                  as={Button}
                  ripple={false}
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  <svg
                    className="me-3 h-3 w-3 scale-150 text-gray-500 dark:text-gray-400"
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
                  {dataType == "utbk" ? "SNBT - UTBK" : "SNBP - TKA"}
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
                  className="z-10 w-41.5 divide-y divide-gray-100 rounded-lg border-none bg-white shadow-sm outline-none dark:divide-gray-600 dark:bg-gray-700"
                >
                  <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
                    <Menu.Item
                      as="li"
                      className="flex items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setDataType("utbk");
                        changeData(date.utbk[0], 0, "utbk");
                      }}
                    >
                      <input
                        id="type-utbk"
                        type="radio"
                        defaultValue=""
                        name="date-radio"
                        checked={dataType == "utbk"}
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                        readOnly
                      />
                      <label
                        htmlFor="type-utbk"
                        className="ms-2 w-full rounded-sm text-left text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        SNBT - UTBK
                      </label>
                    </Menu.Item>
                    <Menu.Item
                      as="li"
                      className="flex items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setDataType("tka");
                        changeData(date.tka[0], 0, "tka");
                      }}
                    >
                      <input
                        id="type-tka"
                        type="radio"
                        defaultValue=""
                        name="date-radio"
                        checked={dataType == "tka"}
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                        readOnly
                      />
                      <label
                        htmlFor="type-tka"
                        className="ms-2 w-full rounded-sm text-left text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        SNBP - TKA
                      </label>
                    </Menu.Item>
                    <Menu.Item
                      as="li"
                      className="flex items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setDataType("toefl");
                        changeData(date.toefl[0], 0, "toefl");
                      }}
                    >
                      <input
                        id="type-tka"
                        type="radio"
                        defaultValue=""
                        name="date-radio"
                        checked={dataType == "toefl"}
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                        readOnly
                      />
                      <label
                        htmlFor="type-toefl"
                        className="ms-2 w-full rounded-sm text-left text-sm font-medium text-gray-900 dark:text-gray-300"
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
                  className="ml-2 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
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
                  {convertDateString(selectedJSON.date)}
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
                  className="z-10 w-49 divide-y divide-gray-100 rounded-lg border-none bg-white shadow-sm outline-none dark:divide-gray-600 dark:bg-gray-700"
                >
                  <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
                    {date[dataType].map((str, key) => (
                      <Menu.Item
                        as="li"
                        key={key}
                        className="flex items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                          if (date[dataType][key] != selectedJSON)
                            changeData(
                              date[dataType][key],
                              selectedType,
                              dataType,
                            );
                        }}
                      >
                        <input
                          id={`date-` + key}
                          type="radio"
                          defaultValue=""
                          name="date-radio"
                          checked={date[dataType][key] == selectedJSON}
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                          readOnly
                        />
                        <label
                          htmlFor={`date-` + key}
                          className="ms-2 w-full rounded-sm text-left text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {convertDateString(str.date)}
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
                  className="ml-2 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  <svg
                    className="me-3 h-3 w-3 scale-150 text-gray-500 dark:text-gray-400"
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
                  {selectedJSON.types[selectedType]?.toLowerCase() == "real"
                    ? "ASLI / " +
                      selectedJSON.types[selectedType]?.toUpperCase()
                    : selectedJSON.types[selectedType]?.toUpperCase()}
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
                  className="z-10 w-37 divide-y divide-gray-100 rounded-lg border-none bg-white shadow-sm outline-none dark:divide-gray-600 dark:bg-gray-700"
                >
                  <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
                    {selectedJSON.types.map((str, key) => (
                      <Menu.Item
                        as="li"
                        key={key}
                        className="flex items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                          if (key != selectedType)
                            changeData(selectedJSON, key, dataType);
                        }}
                      >
                        <input
                          id={`type-` + key}
                          type="radio"
                          defaultValue=""
                          name="type-radio"
                          checked={key == selectedType}
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                          readOnly
                        />
                        <label
                          htmlFor={`type-` + key}
                          className="ms-2 w-full rounded-sm text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {str.toLowerCase() == "real"
                            ? "ASLI / " + str.toUpperCase()
                            : str.toUpperCase()}
                        </label>
                      </Menu.Item>
                    ))}
                  </ul>
                </Menu.Content>
              </Menu>
            </div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="flex flex-col flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
              <Menu>
                <Menu.Trigger
                  as={Button}
                  ripple={false}
                  className="mr-2 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
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
                  <span className="ms-2 rounded-sm bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Beta
                  </span>
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
                  className="z-10 w-55 divide-y divide-gray-100 rounded-lg border-none bg-white shadow-sm outline-none dark:divide-gray-600 dark:bg-gray-700"
                >
                  <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
                    {schools.map((str, key) => (
                      <Menu.Item
                        as="li"
                        key={key}
                        closeOnClick={false}
                        className="flex items-center rounded-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onChange={() => toggleSchools(str)}
                        ripple={false}
                      >
                        <input
                          id={`checkbox-item-` + key}
                          type="checkbox"
                          checked={selectedSchools.includes(str)}
                          className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                          readOnly
                        />
                        <label
                          htmlFor={`checkbox-item-` + key}
                          className="ms-2 w-full rounded-sm text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {str?.toUpperCase()}
                        </label>
                      </Menu.Item>
                    ))}
                  </ul>
                </Menu.Content>
              </Menu>
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
                <input
                  type="text"
                  id="table-search"
                  className="block w-60 rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Cari Nama Siswa / No. Peserta"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            {dataType == "utbk"
              ? (selectedType == 0 && <UTBKIRTTable data={filteredData} />) ||
                (selectedType == 1 && <UTBKRealTable data={filteredData} />)
              : selectedJSON == date.tka[date.tka.length - 1]
                ? (selectedType == 0 && (
                    <SAINTEKOldTable data={filteredData} />
                  )) ||
                  (selectedType == 1 && (
                    <SOSHUMWithAverageTable data={filteredData} />
                  ))
                : (selectedType == 0 &&
                  selectedJSON.compatibility.includes("CIVICS") ? (
                    <SAINTEKWithCivicsTable data={filteredData} />
                  ) : selectedJSON.compatibility.includes("AVERAGE") ? (
                    <SAINTEKWithAverageTable data={filteredData} />
                  ) : (
                    <SAINTEKTable data={filteredData} />
                  )) ||
                  (selectedType == 1 &&
                    (selectedJSON.compatibility.includes("CIVICS") ? (
                      <SOSHUMWithCivicsTable data={filteredData} />
                    ) : selectedJSON.compatibility.includes("AVERAGE") ? (
                      <SOSHUMWithAverageTable data={filteredData} />
                    ) : (
                      <SOSHUMTable data={filteredData} />
                    ))) ||
                  (selectedType == 2 &&
                    (selectedJSON.compatibility.includes("AVERAGE") ? (
                      <KHOSWithAverageTable data={filteredData} />
                    ) : (
                      <KHOSTable data={filteredData} />
                    )))}
          </div>
        </div>
        <footer className="bg-white px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24 dark:bg-gray-900">
          {/*// TODO: Adding scroll to top button */}
          {/* <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
          <a
            href="#"
            className="inline-block rounded-full bg-green-500 p-2 text-white shadow transition hover:bg-green-600 sm:p-3 lg:p-4"
          >
            <span className="sr-only">Back to top</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div> */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <div className="flex justify-center text-gray-600 sm:justify-start dark:text-white">
                <img src="./logo.png" className="h-11" alt="AU Logo" />
                <span className="font-Revans self-center px-3 pt-3 text-2xl font-semibold whitespace-nowrap sm:pt-0">
                  Amanatul Ummah Try Out Statistics
                </span>
              </div>
              <p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-sm sm:text-left dark:text-gray-400">
                Sebuah project yang bertujuan untuk merekap hasil tryout akbar
                dari PP. Amanatul Ummah
              </p>
              <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
                <li>
                  <a
                    href="https://instagram.com/arvin_d.t"
                    rel="noreferrer"
                    target="_blank"
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="size-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ARVIN3108/au-tryout-statistics"
                    rel="noreferrer"
                    target="_blank"
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                  >
                    <span className="sr-only">GitHub</span>
                    <svg
                      className="size-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-100 pt-6 dark:border-gray-800">
            <div className="text-center sm:flex sm:justify-between sm:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="block sm:inline">
                  &copy; Dibuat Oleh ARVIN D.T
                </span>
              </p>

              <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
                Project ini dibuat murni dari inisiatif sang kreator sendiri dan
                tidak didukung oleh pihak pesantren.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
