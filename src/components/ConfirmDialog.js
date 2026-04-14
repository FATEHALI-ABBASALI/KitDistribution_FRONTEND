export default function ConfirmDialog({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">

      <div className="confirm-modal">
        {/* Title */}
        <h3 className="confirm-title">Are you sure?</h3>

        {/* Message */}
        <p className="confirm-text">
          This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="confirm-actions">
          <button onClick={onConfirm} className="btn-danger">
            Delete
          </button>

          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>

    </div>
  );
}
