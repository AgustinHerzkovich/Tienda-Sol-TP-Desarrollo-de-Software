import { useState, useEffect, useRef, useCallback } from 'react';
import { FaRegBell } from 'react-icons/fa6';
import { useSession } from '../../context/SessionContext';
import {
  getNotificacionesByUsuario,
  marcarNotificacionComoLeida,
} from '../../services/notificacionService';
import './Notificaciones.css';
import Notificacion from './Notificacion';

export default function Notificaciones() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState({
    leidas: [],
    noLeidas: [],
  });
  const { user } = useSession();
  const dropdownRef = useRef(null);

  const fetchNotificaciones = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [leidas, noLeidas] = await Promise.all([
        getNotificacionesByUsuario(user.id, true),
        getNotificacionesByUsuario(user.id, false),
      ]);

      setNotificaciones({
        leidas,
        noLeidas,
      });
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  }, [user?.id]);

  const marcarComoLeida = async (notificacionId) => {
    try {
      await marcarNotificacionComoLeida(notificacionId);
      await fetchNotificaciones();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSeeNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notificaciones-container" ref={dropdownRef}>
      <button
        className="notificaciones-button"
        title="notificaciones"
        onClick={handleSeeNotifications}
      >
        <FaRegBell />
        {notificaciones.noLeidas.length > 0 && (
          <span className="notificacion-badge">
            {notificaciones.noLeidas.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notificaciones-dropdown">
          <div className="notificaciones-columns">
            <div className="no-leidas-section">
              <h4 className="no-leidas-label">No leídas</h4>
              <div className="notificaciones-list">
                {notificaciones.noLeidas.length > 0 ? (
                  notificaciones.noLeidas.map((notif) => (
                    <Notificacion
                      key={notif.id}
                      className="no-leida"
                      notif={notif}
                      onClick={() => marcarComoLeida(notif.id)}
                    />
                  ))
                ) : (
                  <p className="no-notificaciones">Sin notificaciones nuevas</p>
                )}
              </div>
            </div>

            <div className="leidas-section">
              <h4 className="leidas-label">Leídas</h4>
              <div className="notificaciones-list">
                {notificaciones.leidas.length > 0 ? (
                  notificaciones.leidas.map((notif) => (
                    <Notificacion key={notif.id} notif={notif} className="leida" />
                  ))
                ) : (
                  <p className="no-notificaciones">Sin notificaciones leídas</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
