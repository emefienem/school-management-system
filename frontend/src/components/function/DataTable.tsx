import React, { useState } from "react";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

interface Row {
  id: string;
  [key: string]: any;
}

interface ButtonHaverProps {
  row: Row;
}

interface TableTemplateProps {
  buttonHaver: React.ComponentType<ButtonHaverProps>;
  columns: Column[];
  rows: Row[];
}

const TableTemplate: React.FC<TableTemplateProps> = ({
  buttonHaver: ButtonHaver,
  columns,
  rows,
}) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider flex justify-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <td
                      key={column.id}
                      className={`px-6 py-4 whitespace-nowrap ${
                        column.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </td>
                  );
                })}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ButtonHaver row={row} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center p-4">
        <div>
          <label htmlFor="rowsPerPage" className="mr-2">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="border rounded p-1"
          >
            {[5, 10, 25, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={(e) => handleChangePage(e, page - 1)}
            disabled={page === 0}
            className={`px-3 py-1 border rounded ${
              page === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <span className="mx-2">{page + 1}</span>
          <button
            onClick={(e) => handleChangePage(e, page + 1)}
            disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
            className={`px-3 py-1 border rounded ${
              page >= Math.ceil(rows.length / rowsPerPage) - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableTemplate;
