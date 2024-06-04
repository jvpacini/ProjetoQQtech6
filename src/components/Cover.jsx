import PropTypes from "prop-types";
import "./Cover.css";

function Cover({ isVisible, onClose }) {
  if (!isVisible) return null;

  return <div className="cover" onClick={onClose}></div>;
}

Cover.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Cover;
