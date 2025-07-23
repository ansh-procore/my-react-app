import React from 'react';
import './DeleteConfirmationModel.css';

const DeleteConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-icon">⚠️</span> {/* Warning icon */}
          <h3>Delete Task</h3> {/* Title */}
          <button className="modal-close-button" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p> {/* Customizable message */}
        </div>
        <div className="modal-footer">
          <button className="modal-cancel-button" onClick={onCancel}>Cancel</button>
          <button className="modal-delete-button" onClick={onConfirm}>Delete Task</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;