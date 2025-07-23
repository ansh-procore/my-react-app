import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MockAPIService from '../services/MockAPI';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    initiated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await MockAPIService.getAllTasks();
      if (response.success) {
        const tasks = response.data;
        const newStats = {
          total: tasks.length,
          inProgress: tasks.filter(task => task.status === 'In Progress').length,
          completed: tasks.filter(task => task.status === 'Completed').length,
          initiated: tasks.filter(task => task.status === 'Initiated').length
        };
        setStats(newStats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Task Management System</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{loading ? '...' : stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{loading ? '...' : stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{loading ? '...' : stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Initiated</h3>
          <p className="stat-number">{loading ? '...' : stats.initiated}</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/tasks" className="action-button">
          View All Tasks
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
