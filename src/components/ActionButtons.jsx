import PropTypes from "prop-types";
import "./ActionButtons.css";

function ActionButton({ buttons }) {
  return (
    <div className="actions">
      {buttons.map((button, index) => (
        <button key={index} onClick={button.onClick}>
          {button.text}
        </button>
      ))}
    </div>
  );
}

ActionButton.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
};

export default ActionButton;
