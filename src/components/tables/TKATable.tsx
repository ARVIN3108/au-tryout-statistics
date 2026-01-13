import type { Row } from "read-excel-file";

export default function TKATable({ data }: { data: Row[] }) {
  return (
    <table className="w-full text-center text-sm text-gray-500 opacity-90 rtl:text-right dark:text-gray-400">
      <thead className="border-b-2 bg-gray-50 text-xs whitespace-nowrap text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
        <tr>
          <th scope="col" className="rounded-tl-lg p-3">
            No
          </th>
          <th scope="col" className="py-3">
            No. Peserta
          </th>
          <th scope="col" className="py-3">
            Nama Siswa
          </th>
          <th scope="col" className="py-3">
            <br />
            Bahasa Indonesia
          </th>
          <th scope="col" className="py-3">
            <span className="absolute -mt-0.5 -ml-18">
              Mata Pelajaran Wajib
            </span>
            <br />
            Matematika
          </th>
          <th scope="col" className="py-3">
            <br />
            Bahasa Inggris
          </th>
          <th scope="col" className="py-3">
            <span className="absolute -mt-0.5 -ml-6">
              Mapel Peminatan Pilihan 1
            </span>
            <br />
            Mata Pelajaran
          </th>
          <th scope="col" className="py-3">
            <br />
            Nilai (Pangkat)
          </th>
          <th scope="col" className="py-3">
            <span className="absolute -mt-0.5 -ml-6">
              Mapel Peminatan Pilihan 2
            </span>
            <br />
            Mata Pelajaran
          </th>
          <th scope="col" className="rounded-tr-lg py-3">
            <br />
            Nilai (Pangkat)
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
                className={`w-1 p-1 ${rowIndex == data.length - 1 && "rounded-bl-lg"}`}
              >
                {rowIndex + 1}
              </td>
              {row.map((cell, cellIndex) => {
                if (cellIndex == 1)
                  return (
                    <th
                      key={cellIndex}
                      scope="row"
                      className="py-3 pl-4 text-left whitespace-nowrap text-gray-900 dark:text-white"
                    >
                      {cell as string}
                    </th>
                  );
                return (
                  <td
                    key={cellIndex}
                    className={`whitespace-nowrap ${(cellIndex == 5 || cellIndex == 7) && "text-gray-900 dark:text-white"} ${cellIndex == 8 && rowIndex == data.length - 1 && "rounded-br-lg"}`}
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
