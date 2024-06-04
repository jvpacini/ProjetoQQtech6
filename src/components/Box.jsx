import PropTypes from "prop-types";
import "./Box.css";

function Box({ isVisible, onClose, title, children, onConfirm }) {
  if (!isVisible) return null;

  return (
    <div className="Box">
      <div className="Box-content">
        <h2>{title}</h2>
        {children}
        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Voltar
          </button>
          <button type="button" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

Box.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Box;
