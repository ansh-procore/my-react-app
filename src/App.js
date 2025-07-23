import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import About from './pages/About';
import TaskDetailsPage from './pages/TaskDetailsPage';
import TaskEditPage from './pages/TaskEditPage';
import TaskCreatePage from './pages/TaskCreatePage'; // Import the new TaskCreatePage component

function App() {
  return (
    <Router>
      <div className='app-container'>
        <Navigation />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/details/:id" element={<TaskDetailsPage />} />
            <Route path="/tasks/edit/:id" element={<TaskEditPage />} />
            <Route path="/tasks/create" element={<TaskCreatePage />} /> {/* New route for task creation */}
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;