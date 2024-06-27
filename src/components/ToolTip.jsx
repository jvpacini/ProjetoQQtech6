import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

const ToolTip = ({ id, description }) => {
  return (
    <>
      <div data-tip data-for={id}>
        {description}
      </div>
      <ReactTooltip id={id} place="top" effect="solid">
        {description}
      </ReactTooltip>
    </>
  );
};

ToolTip.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ToolTip;
