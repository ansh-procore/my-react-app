import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MockAPIService from '../services/MockAPI';
import './TaskDetailsPage.css'; // You'll need to create this CSS file for styling

const TaskDetailsPage = () => {
  const { id } = useParams(); // Get the task ID from the URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await MockAPIService.getTaskById(id);
        if (response.success) {
          setTask(response.data);
        } else {
          setError(response.error || 'Failed to fetch task details');
        }
      } catch (err) {
        setError('An error occurred while fetching task details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="task-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-details-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <Link to="/tasks" className="retry-button">
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-container">
        <div className="error-container">
          <p className="error-message">Task not found.</p>
          <Link to="/tasks" className="retry-button">
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-container">
      <div className="task-details-card">
        <h1>Task: {task.title}</h1>
        <p><strong>Task Number:</strong> {task.number}</p>
        <p><strong>Status:</strong> <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></p>
        <p><strong>Assignee:</strong> {task.assignee}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Rich Text Description:</strong> <span dangerouslySetInnerHTML={{ __html: task.descriptionRichText }} /></p>
        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
        {task.deletedAt && <p><strong>Deleted At:</strong> {new Date(task.deletedAt).toLocaleString()}</p>}
        <Link to="/tasks" className="back-button">
          ← Back to All Tasks
        </Link>
      </div>
    </div>
  );
};

export default TaskDetailsPage;