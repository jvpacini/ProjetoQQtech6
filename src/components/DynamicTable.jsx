import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./DynamicTable.css";

function DynamicTable({ columns, data, maxRows, onRowSelect }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const formatCellData = (cellData) => {
    if (Array.isArray(cellData)) {
      return cellData.join(", ");
    }
    return cellData;
  };

  const handleRowClick = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    if (onRowSelect) {
      onRowSelect(data[rowIndex]);
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dynamic-table")) {
      setSelectedRowIndex(null);
      if (onRowSelect) {
        onRowSelect(null);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <table className="dynamic-table">
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
            className={rowIndex === selectedRowIndex ? "selected-row" : ""}
            onClick={() => handleRowClick(rowIndex)}
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
  onRowSelect: PropTypes.func,
};

export default DynamicTable;
