import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ModalCancelarPedido.css';

export default function ModalCancelarPedido({ isOpen, onClose, onConfirm, pedidoId }) {
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (motivo.trim()) {
      onConfirm(pedidoId, motivo.trim());
      setMotivo('');
      onClose();
    }
  };

  const handleClose = () => {
    setMotivo('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cancelar Pedido</h2>
          <button className="modal-close-btn" aria-label="Cerrar" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label htmlFor="motivo-cancelacion">
              Por favor, indicá el motivo de la cancelación:
            </label>
            <textarea
              id="motivo-cancelacion"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Ya no necesito el producto, encontré mejor precio, etc."
              rows="4"
              required
              maxLength="500"
            />
            <small className="char-count">{motivo.length}/500 caracteres</small>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Volver
            </button>
            <button type="submit" className="btn-danger" disabled={!motivo.trim()}>
              Confirmar Cancelación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
