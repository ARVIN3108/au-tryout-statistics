import type { Row } from "read-excel-file/node";

export default function TOAFLTable({ data }: { data: Row[] }) {
  return (
    <table className="w-full text-center text-sm text-gray-500 opacity-90 rtl:text-right dark:text-gray-400">
      <thead className="border-b-2 bg-gray-50 text-xs whitespace-nowrap text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
        <tr>
          <th scope="col" className="rounded-tl-lg p-4">
            No
          </th>
          <th scope="col" className="p-4">
            Rank
            <br />
            Se-AU
          </th>
          <th scope="col" className="px-6 py-3">
            No. Peserta
          </th>
          <th scope="col" className="px-6 py-3">
            Nama Siswa
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 ml-1.5">ISTIMA&apos;</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 ml-0.5">QIROAH</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5">KITABAH</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 ml-0.5">NAHWU</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 ml-0.5">SHOROF</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 -ml-2">BALAGHOH</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="px-6 py-3">
            Total
          </th>
          <th scope="col" className="px-6 py-3">
            Rata
            <br />
            Rata
          </th>
          <th scope="col" className="rounded-tr-lg px-6 py-3">
            Lembaga
          </th>
        </tr>
      </thead>
      <tbody className="whitespace-nowrap lg:whitespace-normal">
        {data &&
          data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowIndex != data.length - 1 && "border-b-2"} border-gray-200 bg-white font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600`}
            >
              <td
                className={`w-4 p-4 ${rowIndex == data.length - 1 && "rounded-bl-lg"}`}
              >
                {rowIndex + 1}
              </td>
              {row.map((cell, cellIndex) => {
                if (cellIndex == 1 || cellIndex == 17)
                  return (
                    <td
                      key={cellIndex}
                      className={`px-6 py-4 ${cellIndex == 17 && `text-gray-900 dark:text-white ${rowIndex == data.length - 1 && "rounded-br-lg"}`}`}
                    >
                      {cell as string}
                    </td>
                  );
                if (cellIndex == 2)
                  return (
                    <th
                      key={cellIndex}
                      scope="row"
                      className="px-6 py-4 text-left whitespace-nowrap text-gray-900 dark:text-white"
                    >
                      {cell as string}
                    </th>
                  );
                if (cellIndex >= 3 && cellIndex <= 16)
                  return (
                    <td key={cellIndex} className="w-4 p-4">
                      {Math.round(parseFloat(cell as string))}
                    </td>
                  );
                return (
                  <td
                    key={cellIndex}
                    className={`w-4 p-4 ${cellIndex == 0 && "text-gray-900 dark:text-white"}`}
                  >
                    {cell as string}
                  </td>
                );
              })}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
