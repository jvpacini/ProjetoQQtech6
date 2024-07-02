import { useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import api from "../services/api";

const CustomMultiSelectModal = ({
  fetchUrl,
  placeholder,
  onChange,
  valueKey,
  labelKey,
}) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(fetchUrl);
        const data = response.data.map((item) => ({
          value: item[valueKey],
          label: item[labelKey],
        }));
        setOptions(data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [fetchUrl, valueKey, labelKey]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    onChange(selected ? selected.map((option) => option.value) : []);
    console.log("Selected Options:", selected);
  };

  return (
    <Select
      styles={{ marginBottom: "10px" }}
      isMulti
      value={selectedOptions}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
    />
  );
};

CustomMultiSelectModal.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  valueKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
};

export default CustomMultiSelectModal;
