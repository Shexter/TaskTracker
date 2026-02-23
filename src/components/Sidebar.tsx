import {
    LayoutDashboard,
    CalendarDays,
    CalendarRange,
    Calendar,
    ListTodo,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    User,
    Sparkles,
    Sun,
} from 'lucide-react';
import './Sidebar.css';

export type Page = 'dashboard' | 'calendar' | 'week' | 'day' | 'year' | 'tasks' | 'chat';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    collapsed: boolean;
    onToggleCollapsed: () => void;
}

type NavItem = { id: Page; label: string; icon: React.ReactNode; indent?: boolean };

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'calendar', label: 'Month View', icon: <CalendarDays size={20} /> },
    { id: 'week', label: 'Week View', icon: <CalendarRange size={20} />, indent: true },
    { id: 'day', label: 'Day View', icon: <Sun size={20} />, indent: true },
    { id: 'year', label: 'Year View', icon: <Calendar size={20} />, indent: true },
    { id: 'tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare size={20} /> },
];

export default function Sidebar({
    currentPage,
    onNavigate,
    collapsed,
    onToggleCollapsed,
}: SidebarProps) {
    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <Sparkles size={20} />
                    </div>
                    {!collapsed && <span className="logo-text">TaskTracker</span>}
                </div>
                <button
                    className="sidebar-toggle btn-ghost"
                    onClick={onToggleCollapsed}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''} ${item.indent ? 'indent' : ''}`}
                        onClick={() => onNavigate(item.id)}
                        title={collapsed ? item.label : undefined}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                        {currentPage === item.id && <span className="nav-indicator" />}
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="user-avatar">
                        <User size={16} />
                    </div>
                    {!collapsed && (
                        <div className="user-info">
                            <span className="user-name">TaskTracker User</span>
                            <span className="user-email">user@tasktracker.dev</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
