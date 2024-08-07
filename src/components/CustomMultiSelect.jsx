import { useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import api from "../services/api";

const CustomMultiSelect = ({ fetchUrl, placeholder, onChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(fetchUrl);
        const data = response.data.map((module) => ({
          value: module.id_modulo,
          label: module.codigo_modulo,
        }));
        setOptions(data);
      } catch (error) {
        console.error("Error loading modules:", error);
      }
    };

    fetchData();
  }, [fetchUrl]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    onChange(selected ? selected.map((option) => option.value) : []);
    console.log("Selected Options:", selected);
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
