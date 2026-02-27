import type { Row } from "read-excel-file/node";

export default function SAINTEKWithAverageTable({ data }: { data: Row[] }) {
  return (
    <table className="w-full text-center text-sm text-gray-500 opacity-90 rtl:text-right dark:text-gray-400">
      <thead className="border-b-2 bg-gray-50 text-xs whitespace-nowrap text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-300">
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
            <span className="absolute -mt-0.5 -ml-2">INDONESIA</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5">ENGLISH</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 -ml-2">MAT WAJIB</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 -ml-2.5">MAT MINAT</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 ml-2">FISIKA</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 ml-0.5">BIOLOGI</span>
            <br />
            BNR
          </th>
          <th scope="col" className="p-4">
            <br />
            NIL
          </th>
          <th scope="col" className="p-4">
            <span className="absolute -mt-0.5 ml-2">KIMIA</span>
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
              className={`${rowIndex != data.length - 1 && "border-b-2"} border-gray-200 bg-white font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800`}
            >
              <td
                className={`w-2 p-2 ${rowIndex == data.length - 1 && "rounded-bl-lg"}`}
              >
                {rowIndex + 1}
              </td>
              {row.map((cell, cellIndex) => {
                if (cellIndex == 1 || cellIndex == 19)
                  return (
                    <td
                      key={cellIndex}
                      className={`px-6 py-4 ${cellIndex == 19 && `text-gray-900 dark:text-white ${rowIndex == data.length - 1 && "rounded-br-lg"}`}`}
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
                if (cellIndex >= 3 && cellIndex <= 18)
                  return (
                    <td key={cellIndex} className="w-2 p-2">
                      {Number(parseFloat(`${cell}`).toFixed(2))}
                    </td>
                  );
                return (
                  <td
                    key={cellIndex}
                    className={`w-2 p-2 ${cellIndex == 0 && "text-gray-900 dark:text-white"}`}
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
