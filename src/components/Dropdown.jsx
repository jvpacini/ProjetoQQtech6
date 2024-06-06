import PropTypes from "prop-types";
import "./Dropdown.css";

const Dropdown = ({ options, selectedOption, onSelect, placeholder }) => {
  return (
    <select
      className="form-select"
      value={selectedOption}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOption: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

Dropdown.defaultProps = {
  placeholder: "Selecione uma opção",
};

export default Dropdown;
