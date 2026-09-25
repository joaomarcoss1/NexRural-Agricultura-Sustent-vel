export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onCancel}>×</button>
        <div className="modal-header"><h3>{title}</h3></div>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="secondary-btn" onClick={onCancel}>Cancelar</button>
          <button className="danger-btn" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
