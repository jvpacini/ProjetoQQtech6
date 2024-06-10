import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from "react-select/async";

const CustomMultiSelect = ({ fetchUrl, preSelectedOptions }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(preSelectedOptions || []);

  useEffect(() => {
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        const formattedOptions = data.map(item => ({
          value: item.id,
          label: item.nome,
        }));
        setOptions(formattedOptions);
      })
      .catch(error => console.error('Erro ao carregar opções:', error));
  }, [fetchUrl]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions={options}
      value={selectedOptions}
      loadOptions={(inputValue, callback) => {
        setTimeout(() => {
          callback(options.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase())));
        }, 1000);
      }}
      onChange={handleChange}
    />
  );
};

CustomMultiSelect.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  preSelectedOptions: PropTypes.array,
};

export default CustomMultiSelect;
