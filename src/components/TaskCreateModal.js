import React, { useState } from 'react';
import MockAPIService from '../services/MockAPI';
import './TaskCreateModal.css';

const TaskCreateModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [task, setTask] = useState({
    number: '',
    title: '',
    status: 'initiated',
    assignee: '',
    description: '',
    descriptionRichText: '',
    dueDate: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const statuses = ['initiated', 'in_progress', 'completed', 'pending'];
  const priorities = ['normal', 'high', 'medium'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const now = new Date().toISOString();
      const taskToCreate = {
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        createdAt: now,
        updatedAt: now,
      };

      const response = await MockAPIService.createTask(taskToCreate);
      if (response.success) {
        alert('Task created successfully!');
        onTaskCreated();
        onClose();
      } else {
        setSubmitError(response.error || 'Failed to create task');
      }
    } catch (err) {
      setSubmitError('An error occurred during task creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="number">Number *</label>
              <input
                type="text"
                id="number"
                name="number"
                value={task.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={task.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" value={task.status} onChange={handleChange} required>
                {statuses.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority *</label>
              <select id="priority" name="priority" value={task.priority} onChange={handleChange} required>
                {priorities.map(p => (
                  <option key={p} value={p}>{p.replace(/\b\w/g, char => char.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="assignee">Assignee(s)</label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                value={task.assignee}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              rows="5"
            ></textarea>
          </div>
          <div className="form-group full-width">
            <label htmlFor="descriptionRichText">Description (Rich Text)</label>
            <textarea
              id="descriptionRichText"
              name="descriptionRichText"
              value={task.descriptionRichText}
              onChange={handleChange}
              rows="3"
            ></textarea>
            <small>Note: This field stores rich text HTML. A dedicated rich text editor library would be needed for a visual editor.</small>
          </div>
          {submitError && <p className="submit-error-message">{submitError}</p>}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="save-changes-button">
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal;