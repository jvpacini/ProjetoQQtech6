import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import PropTypes from "prop-types";

const CustomSingleSelect = ({ fetchUrl, placeholder, onChange, selectedValue }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          value: item.nome,
          label: item.nome,
        }));
        setDefaultOptions(formattedOptions);
        if (selectedValue) {
          const selected = formattedOptions.find(
            (option) => option.value === selectedValue
          );
          setSelectedOption(selected);
        }
      })
      .catch((error) => console.error("Erro ao carregar perfis:", error));
  }, [fetchUrl, selectedValue]);

  const loadOptions = (inputValue, callback) => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          value: item.nome,
          label: item.nome,
        }));
        callback(formattedOptions.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase())));
      })
      .catch((error) => console.error("Erro ao carregar perfis:", error));
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
