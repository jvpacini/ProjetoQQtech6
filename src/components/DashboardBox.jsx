import PropTypes from "prop-types";
import styled from "styled-components";

const BoxContainer = styled.div`
  background-color: #d9d9d9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  width: 280px;
`;

const BoxContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const BoxTitle = styled.h2`
  font-size: 18px;
  margin: 0;
  color: #333;
`;

const BoxSubtitle = styled.p`
  font-size: 14px;
  margin: 0;
  color: #666;
`;

const Icon = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const DashboardBox = ({ icon, title, subtitle }) => {
  return (
    <BoxContainer>
      <Icon src={icon} alt={title} />
      <BoxContent>
        <BoxTitle>{title}</BoxTitle>
        <BoxSubtitle>{subtitle}</BoxSubtitle>
      </BoxContent>
    </BoxContainer>
  );
};

DashboardBox.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default DashboardBox;
