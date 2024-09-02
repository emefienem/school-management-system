import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  format?: (value: number) => string;
}

interface Row {
  [key: string]: any;
}

interface TableViewProps {
  columns: Column[];
  rows: Row[];
}

const TableView: React.FC<TableViewProps> = ({ columns, rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-2 text-left font-medium text-gray-600 ${
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                    ? "text-right"
                    : ""
                }`}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, rowIndex) => (
            <tr key={row.id} className="border-b">
              {columns.map((column, colIndex) => {
                const value = row[column.id];
                return (
                  <td
                    key={colIndex}
                    className={`px-4 py-2 ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : ""
                    }`}
                  >
                    {column.format && typeof value === "number"
                      ? column.format(value)
                      : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center p-2">
        <select
          className="border p-1 rounded"
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
        >
          {[5, 10, 25, 100].map((rowsOption) => (
            <option key={rowsOption} value={rowsOption}>
              {rowsOption} rows
            </option>
          ))}
        </select>
        <div className="flex items-center">
          <button
            className="p-2"
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft />
          </button>
          <span className="px-2">
            Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
          </span>
          <button
            className="p-2"
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableView;
