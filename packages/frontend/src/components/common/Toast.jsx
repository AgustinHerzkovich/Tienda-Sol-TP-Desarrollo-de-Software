import './Toast.css';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 8000) => {
    const id = Date.now();
    // si ya hay una toast igual que no está saliendo, no crear otra
    setToasts((prev) => {
      const exists = prev.some(t => t.message === message && t.type === type && !t.isExiting);
      if (exists) return prev;
      const id = Date.now();
      return [...prev, { id, message, type, isExiting: false }];
    });

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 500);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="toast-container"
        role="region"
        aria-live="polite"
        aria-label="Notificaciones"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${toast.isExiting ? 'toast-slide-out' : 'toast-slide-in'}`}
            role="alert"
            aria-live="assertive"
          >
            <div className="toast-icon">
              {toast.type === 'success' && <FaCheckCircle />}
              {toast.type === 'error' && <FaExclamationCircle />}
              {toast.type === 'info' && <FaInfoCircle />}
            </div>
            <span style={{ whiteSpace: 'pre-line' }} className="toast-message">
              {toast.message}
            </span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};
