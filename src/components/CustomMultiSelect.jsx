import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import PropTypes from "prop-types";
import styled from "styled-components";

const MultiSelectContainer = styled.div`
  margin-bottom: 15px;
`;

const CustomMultiSelect = ({ fetchUrl, placeholder, onChange, initialSelected }) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(initialSelected || []);

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
      setSelected(initialSelected.map(item => ({ label: item, value: item })));
    }
  }, [initialSelected]);

  const handleChange = (selectedOptions) => {
    setSelected(selectedOptions);
    onChange(selectedOptions.map(option => option.value));
  };

  return (
    <MultiSelectContainer>
      <MultiSelect
        options={options}
        value={selected}
        onChange={handleChange}
        labelledBy={placeholder}
      />
    </MultiSelectContainer>
  );
};

CustomMultiSelect.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  initialSelected: PropTypes.arrayOf(PropTypes.string),
};

export default CustomMultiSelect;