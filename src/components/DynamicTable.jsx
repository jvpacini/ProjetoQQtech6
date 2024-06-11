import PropTypes from "prop-types";
import "./DynamicTable.css";
import { useState, useEffect, useRef } from "react";

function DynamicTable({ columns, data, maxRows, onRowClick }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const tableRef = useRef(null);

  const formatCellData = (cellData) => {
    if (Array.isArray(cellData)) {
      return cellData.join(", ");
    }
    return cellData;
  };

  const handleRowClick = (rowIndex, row) => {
    setSelectedRowIndex(rowIndex);
    onRowClick(row);
  };

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setSelectedRowIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <table className="dynamic-table" ref={tableRef}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, maxRows).map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={rowIndex === selectedRowIndex ? "selected" : ""}
            onClick={() => handleRowClick(rowIndex, row)}
          >
            {columns.map((col, colIndex) => (
              <td key={colIndex}>{formatCellData(row[col.field])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

DynamicTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxRows: PropTypes.number,
  onRowClick: PropTypes.func.isRequired,
};

export default DynamicTable;
