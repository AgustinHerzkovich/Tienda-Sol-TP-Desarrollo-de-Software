import './LoadingSpinner.css';

export default function LoadingSpinner({ message = "Cargando" }) {
  return (
    <div className="loading-spinner">
      <h2>
        {message}
        <span className="puntitos-container">
          <span className="punto">.</span>
          <span className="punto">.</span>
          <span className="punto">.</span>
        </span>
      </h2>
    </div>
  );
}
