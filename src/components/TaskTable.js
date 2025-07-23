import React, { useState, useEffect, useCallback } from 'react';
import MockAPIService from '../services/MockAPI';
import './TaskTable.css';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModel';

const TaskTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await MockAPIService.getAllTasks();
      if (response.success) {
        setTasks(response.data);
        setTotalTasks(response.total);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError('An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await MockAPIService.searchTasks(searchTerm);
      if (response.success) {
        setTasks(response.data);
        setTotalTasks(response.total);
      } else {
        setError('Failed to search tasks');
      }
    } catch (err) {
      setError('An error occurred while searching tasks');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Fetch tasks when search term changes (with debounce effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchTasks();
      } else {
        fetchTasks();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchTasks, fetchTasks]);

  const handleEdit = (id) => {
    navigate(`/tasks/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/tasks/details/${id}`);
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (id) => {
    setTaskToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setTaskToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // Function to handle the actual deletion after confirmation
  const confirmDelete = async () => {
    if (taskToDeleteId === null) return; // Should not happen

    closeDeleteModal(); // Close modal immediately

    try {
      setLoading(true);
      const response = await MockAPIService.deleteTask(taskToDeleteId);
      if (response.success) {
        // Refresh the task list after deletion
        if (searchTerm.trim()) {
          searchTasks();
        } else {
          fetchTasks();
        }
      } else {
        setError('Failed to delete task');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred while deleting task');
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    navigate('/tasks/create'); // Navigate to the create task page
  };

  if (loading) {
    return (
      <div className="task-table-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-table-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchTasks} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-table-container">
      <div className="table-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
        <div className="header-buttons"> {/* Group buttons for better layout */}
          <button className="create-task-button" onClick={handleCreateTask}>
            ➕ Create
          </button>
          <button className="filters-button">🔽 Filters</button>
        </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Title <span className="sort-arrow">↕</span></th>
            <th>Description</th>
            <th>Assignee(s)</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td><input type="checkbox" /></td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleView(task.id)}
                  >
                    View
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => openDeleteModal(task.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="task-number">{task.id}</div>
              </td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.dueDate}</td>
              <td>{task.assignee}</td>
              <td>
                <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </td>
              <td>
                <span className="lock-icon">🔒</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>{tasks.length} of {totalTasks}</span>
        <div className="pagination">
          <span>Page:</span>
          <select value={currentPage} onChange={(e) => setCurrentPage(parseInt(e.target.value))}>
            <option value={1}>1</option>
          </select>
          <button disabled={currentPage === 1}>‹</button>
          <button disabled={currentPage === 1}>›</button>
        </div>
      </div>

      {/* Render the DeleteConfirmationModal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        message="This Task (including attachments) will be permanently deleted"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default TaskTable;