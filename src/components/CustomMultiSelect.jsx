import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import PropTypes from "prop-types";
import styled from "styled-components";

const MultiSelectContainer = styled.div`
  margin-bottom: 15px;
`;

const CustomMultiSelect = ({ fetchUrl, placeholder, onChange }) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        const optionsData = data.map((item) => ({
          label: item.nome,
          value: item.nome,
        }));
        setOptions(optionsData);
      })
      .catch((error) => console.error("Erro ao carregar opções:", error));
  }, [fetchUrl]);

  useEffect(() => {
    onChange(selected.map((item) => item.value));
  }, [selected, onChange]);

  return (
    <MultiSelectContainer>
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy={placeholder}
      />
    </MultiSelectContainer>
  );
};

CustomMultiSelect.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default CustomMultiSelect;
