import { useState } from 'react';
import { Plus, Trash2, Clock, RefreshCw } from 'lucide-react';
import { mockTasks, type Task } from '../data/mockData';
import './Tasks.css';

const categoryClass: Record<string, string> = {
    Health: 'cat-health',
    Bills: 'cat-bills',
    Taxes: 'cat-taxes',
    Work: 'cat-work',
    Personal: 'cat-personal',
};

const statusClass: Record<string, string> = {
    Active: 'status-completed',
    Inactive: 'status-pending',
    Archived: 'status-skipped',
};

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        category: 'Personal' as Task['category'],
        period: 'Weekly' as Task['period'],
        occurrence: '',
        base_time_minutes: 15,
    });

    const handleDelete = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleAdd = () => {
        if (!form.name || !form.occurrence) return;
        const newTask: Task = {
            id: `t-${Date.now()}`,
            user_id: 'u-001',
            task_id: `T${String(tasks.length + 1).padStart(3, '0')}`,
            name: form.name,
            category: form.category,
            period: form.period,
            occurrence: form.occurrence,
            base_time_minutes: form.base_time_minutes,
            status: 'Active',
            created_at: new Date().toISOString(),
        };
        setTasks((prev) => [...prev, newTask]);
        setForm({ name: '', category: 'Personal', period: 'Weekly', occurrence: '', base_time_minutes: 15 });
        setShowModal(false);
    };

    return (
        <div className="tasks-page">
            <div className="page-header">
                <div className="tasks-header-row">
                    <div>
                        <h1>Tasks</h1>
                        <p>Manage your recurring task definitions</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={16} />
                        Add Task
                    </button>
                </div>
            </div>

            {/* Task Table */}
            <div className="tasks-table-wrapper card">
                <table className="tasks-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Period</th>
                            <th>Occurrence</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="stagger">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="task-id-cell">{task.task_id}</td>
                                <td className="task-name-cell">
                                    <span className="task-name">{task.name}</span>
                                </td>
                                <td>
                                    <span className={`category-badge ${categoryClass[task.category]}`}>
                                        {task.category}
                                    </span>
                                </td>
                                <td>
                                    <span className="period-pill">
                                        <RefreshCw size={12} />
                                        {task.period}
                                    </span>
                                </td>
                                <td className="occurrence-cell">{task.occurrence}</td>
                                <td>
                                    <span className="duration-pill">
                                        <Clock size={12} />
                                        {task.base_time_minutes} min
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${statusClass[task.status]}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-ghost delete-btn"
                                        onClick={() => handleDelete(task.id)}
                                        aria-label="Delete task"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tasks.length === 0 && (
                    <div className="tasks-empty">
                        <p>No tasks yet. Click "Add Task" to get started!</p>
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal glass-strong animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Add New Task</h2>

                        <div className="form-group">
                            <label>Task Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Morning Run"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="form-select"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value as Task['category'] })}
                                >
                                    <option>Health</option>
                                    <option>Bills</option>
                                    <option>Taxes</option>
                                    <option>Work</option>
                                    <option>Personal</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Period</label>
                                <select
                                    className="form-select"
                                    value={form.period}
                                    onChange={(e) => setForm({ ...form, period: e.target.value as Task['period'] })}
                                >
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Yearly</option>
                                    <option>OneTime</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Occurrence</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Mon,Wed,Fri"
                                    value={form.occurrence}
                                    onChange={(e) => setForm({ ...form, occurrence: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Duration (min)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={form.base_time_minutes}
                                    onChange={(e) => setForm({ ...form, base_time_minutes: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleAdd}>
                                <Plus size={16} />
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
