import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <section className="not-found-content">
      <FaExclamationTriangle
        style={{ color: "#f6e05e", fontSize: 32 }}
        className="not-found-icon"
      />
      <h1 className="text-6xl font-bold">404 Não Encontrado</h1>
      <p className="text-xl">
        Essa página não existe ou está indisponível no momento.
      </p>
      <Link to="/" className="back-btn">
        Voltar
      </Link>
    </section>
  );
};
export default NotFoundPage;
