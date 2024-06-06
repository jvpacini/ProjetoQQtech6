import PropTypes from "prop-types";
import "./DynamicTable.css";

function DynamicTable({ columns, data, maxRows }) {
  const formatCellData = (cellData) => {
    if (Array.isArray(cellData)) {
      return cellData.join(", ");
    }
    return cellData;
  };

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
          <tr key={rowIndex}>
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
};

export default DynamicTable;
