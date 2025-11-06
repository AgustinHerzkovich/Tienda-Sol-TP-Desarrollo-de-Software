export default function Notificacion({ notif, onClick }) {
  return (
    <div className="notificacion" key={notif.id}>
      <p style={{ whiteSpace: 'pre-line' }}>{notif.mensaje}</p>
      {onClick && (
        <button className="marcar-leida-btn" onClick={() => onClick()}>
          Marcar como leída
        </button>
      )}
    </div>
  );
}
