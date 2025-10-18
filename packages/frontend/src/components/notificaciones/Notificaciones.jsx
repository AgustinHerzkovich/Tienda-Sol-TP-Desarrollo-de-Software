import { useState, useEffect, useContext, useRef } from 'react';
import { FaRegBell } from "react-icons/fa6";
import { useSession } from '../../context/SessionContext';
import axios from 'axios';
import './Notificaciones.css';

export default function Notificaciones() {
    const [isOpen, setIsOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState({ leidas: [], noLeidas: [] });
    const { user } = useSession();
    const dropdownRef = useRef(null);

    const fetchNotificaciones = async () => {
        if (!user?.id) return;
        
        try {
            const [leidasRes, noLeidasRes] = await Promise.all([
                axios.get(`http://localhost:8000/usuarios/${user.id}/notificaciones?read=true`),
                axios.get(`http://localhost:8000/usuarios/${user.id}/notificaciones?read=false`)
            ]);

            setNotificaciones({
                leidas: leidasRes.data,
                noLeidas: noLeidasRes.data
            });
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
        }
    };

    const marcarComoLeida = async (notificacionId) => {
        try {
            await axios.patch(`http://localhost:8000/notificaciones/${notificacionId}`, {
                read: true
            });
            await fetchNotificaciones();
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    useEffect(() => {
        fetchNotificaciones();
    }, [user]);

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
                <FaRegBell/>
                {notificaciones.noLeidas.length > 0 && (
                    <span className="notificacion-badge">
                        {notificaciones.noLeidas.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notificaciones-dropdown">
                    <div className="no-leidas-section">
                        <h4>No leídas</h4>
                        {notificaciones.noLeidas.map((notif) => (
                            <div key={notif.id} className="notificacion no-leida">
                                    <p>{notif.mensaje}</p>
                                <button 
                                    className="marcar-leida-btn"
                                    onClick={() => marcarComoLeida(notif.id)}
                                >
                                    Marcar como leída
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="leidas-section">
                        <h4>Leídas</h4>
                        {notificaciones.leidas.map((notif) => (
                            <div key={notif.id} className="notificacion leida">
                                <p>{notif.mensaje}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};