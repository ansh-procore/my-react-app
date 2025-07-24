import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import About from './pages/About';
import TaskDetailsPage from './pages/TaskDetailsPage';
import TaskEditPage from './pages/TaskEditPage';
// No longer need to import TaskCreatePage

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
            {/* The /tasks/create route is no longer needed */}
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;