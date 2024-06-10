import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const CustomSingleSelect = ({ fetchUrl, placeholder, onChange, initialSelected }) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          label: item.nome,
          value: item.nome,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => console.error("Erro ao carregar dados:", error));
  }, [fetchUrl]);

  useEffect(() => {
    if (initialSelected) {
      setSelected({ label: initialSelected, value: initialSelected });
    }
  }, [initialSelected]);

  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    onChange(selectedOption ? selectedOption.value : null);
  };

  return (
    <div className="custom-single-select">
      <Select
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

CustomSingleSelect.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  initialSelected: PropTypes.string,
};

export default CustomSingleSelect;
