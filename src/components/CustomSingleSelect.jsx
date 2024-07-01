import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import PropTypes from "prop-types";
import api from "../services/api";

const CustomSingleSelect = ({ fetchUrl, placeholder, onChange, selectedValue }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get(fetchUrl);
        const formattedOptions = response.data.map((item) => ({
          value: item.id_perfil,
          label: item.nome_perfil,
        }));
        setDefaultOptions(formattedOptions);
        if (selectedValue) {
          const selected = formattedOptions.find(
            (option) => option.value === selectedValue
          );
          setSelectedOption(selected);
        }
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
      }
    };
    fetchOptions();
  }, [fetchUrl, selectedValue]);

  const loadOptions = async (inputValue, callback) => {
    try {
      const response = await api.get(fetchUrl);
      const formattedOptions = response.data.map((item) => ({
        value: item.id_perfil,
        label: item.nome_perfil,
      }));
      callback(formattedOptions.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase())));
    } catch (error) {
      console.error("Erro ao carregar perfis:", error);
    }
  };

  const handleChange = (selected) => {
    setSelectedOption(selected);
    onChange(selected ? selected.value : null);
  };

  return (
    <AsyncSelect
      value={selectedOption}
      loadOptions={loadOptions}
      defaultOptions={defaultOptions}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

CustomSingleSelect.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
};

export default CustomSingleSelect;
