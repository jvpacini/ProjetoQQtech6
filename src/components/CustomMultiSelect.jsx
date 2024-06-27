import { useState, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const CustomMultiSelect = ({ fetchUrl, placeholder, onChange, defaultValue }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(defaultValue || []);

  useEffect(() => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          value: item.codigo || item.value,
          label: item.nome || item.label,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => console.error("Error loading options:", error));
  }, [fetchUrl]);

  useEffect(() => {
    setSelectedOptions(defaultValue);
  }, [defaultValue]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    onChange(selected);
  };

  return (
    <Select
      isMulti
      value={selectedOptions}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
    />
  );
};

CustomMultiSelect.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.array,
};

export default CustomMultiSelect;
