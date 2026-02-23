import { useState } from 'react';
import Sidebar, { type Page } from './components/Sidebar';
import ProgressBar from './components/ProgressBar';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import DayView from './pages/DayView';
import WeekView from './pages/WeekView';
import YearView from './pages/YearView';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Welcome onSignIn={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <Calendar />;
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'year':
        return <YearView />;
      case 'tasks':
        return <Tasks />;
      case 'chat':
        return <Chat />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <ProgressBar />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
