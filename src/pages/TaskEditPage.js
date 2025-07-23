import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MockAPIService from '../services/MockAPI';
import './TaskEditPage.css'; // You'll create this CSS file

const TaskEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    number: '',
    title: '',
    status: '',
    assignee: '',
    description: '',
    descriptionRichText: '', // Include if you want to edit this, or remove if not needed
    dueDate: '', // Will be formatted for input type="date" or datetime-local
    priority: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Define static options for consistency with backend and data.sql
  const statuses = ['initiated', 'in_progress', 'completed', 'pending']; // Added 'pending' based on data.sql
  const priorities = ['normal', 'high', 'medium'];

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await MockAPIService.getTaskById(id);
        if (response.success) {
          const fetchedTask = response.data;
          // Format dueDate for datetime-local input
          const formattedDueDate = fetchedTask.dueDate
            ? new Date(fetchedTask.dueDate).toISOString().slice(0, 16)
            : '';
          
          setTask({
            number: fetchedTask.number || '',
            title: fetchedTask.title || '',
            status: fetchedTask.status || '',
            assignee: fetchedTask.assignee || '',
            description: fetchedTask.description || '',
            descriptionRichText: fetchedTask.descriptionRichText || '',
            dueDate: formattedDueDate,
            priority: fetchedTask.priority || ''
          });
        } else {
          setError(response.error || 'Failed to fetch task details');
        }
      } catch (err) {
        setError('An error occurred while fetching task details for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

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
      // Prepare task data for API call
      const taskToUpdate = {
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        // Backend expects ISOString for OffsetDateTime
        updatedAt: new Date().toISOString(), // Set updated time
      };

      const response = await MockAPIService.updateTask(id, taskToUpdate);
      if (response.success) {
        alert('Task updated successfully!');
        navigate('/tasks'); // Redirect back to tasks list
      } else {
        setSubmitError(response.error || 'Failed to update task');
      }
    } catch (err) {
      setSubmitError('An error occurred during update');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-task-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task for editing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-task-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-task-container">
      <div className="edit-task-card">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
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
              <select
                id="status"
                name="status"
                value={task.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                {statuses.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
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
                type="datetime-local" // Use datetime-local for date and time
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
          
          {/* If descriptionRichText is meant to be a separate field and not managed by a rich text editor */}
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

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/tasks')} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="save-changes-button">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditPage;