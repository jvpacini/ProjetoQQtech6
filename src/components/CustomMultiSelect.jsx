import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import PropTypes from "prop-types";
import api from "../services/api";

const CustomMultiSelect = ({ fetchUrl, placeholder, onChange }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(fetchUrl);
        const formattedOptions = response.data.map((item) => ({
          value: item.id_modulo,
          label: item.codigo_modulo,
        }));
        setDefaultOptions(formattedOptions);
      } catch (error) {
        console.error("Erro ao carregar módulos:", error);
      }
    };
    fetchData();
  }, [fetchUrl]);

  const loadOptions = async (inputValue, callback) => {
    try {
      const response = await api.get(fetchUrl);
      const formattedOptions = response.data.map((item) => ({
        value: item.id_modulo,
        label: item.codigo_modulo,
      }));
      callback(
        formattedOptions.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
    }
  };

  const handleChange = (selected) => {
    onChange(selected);
  };

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

CustomMultiSelect.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomMultiSelect;
