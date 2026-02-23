import { useState, useEffect } from 'react';
import { Plus, Trash2, Filter } from 'lucide-react';
import { getTasks, createTask, deleteTask } from '../api/tasks';
import type { Task, RecurrenceRule } from '../types';
import './Tasks.css';

const CATEGORIES = ['Health', 'Bills', 'Taxes', 'Work', 'Personal'] as const;
const PERIODS = ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'OneTime'] as const;

const categoryClass: Record<string, string> = {
    Health: 'cat-health', Bills: 'cat-bills', Taxes: 'cat-taxes',
    Work: 'cat-work', Personal: 'cat-personal',
};

function periodLabel(rule: RecurrenceRule): string {
    if (rule.period === 'Weekly') return `Every ${rule.occurrence}`;
    if (rule.period === 'Monthly') return `Day ${rule.occurrence} of month`;
    if (rule.period === 'Quarterly') return `Quarterly (${rule.occurrence})`;
    if (rule.period === 'Yearly') return `Yearly (${rule.occurrence})`;
    if (rule.period === 'OneTime') return `Once: ${rule.occurrence}`;
    return rule.period;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterCat, setFilterCat] = useState<string>('All');
    const [error, setError] = useState<string | null>(null);

    // New task form state
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState<string>('Health');
    const [newPeriod, setNewPeriod] = useState<string>('Weekly');
    const [newOccurrence, setNewOccurrence] = useState('Mon');
    const [newTime, setNewTime] = useState(15);

    const loadTasks = () => {
        setLoading(true);
        getTasks()
            .then(setTasks)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadTasks(); }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        try {
            await createTask({
                name: newName.trim(),
                category: newCategory,
                recurrence_rule: { period: newPeriod as RecurrenceRule['period'], occurrence: newOccurrence },
                base_time_minutes: newTime,
                priority: 3,
            });
            setShowForm(false);
            setNewName('');
            loadTasks();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
            loadTasks();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const filtered = filterCat === 'All' ? tasks : tasks.filter((t) => t.category === filterCat);

    return (
        <div className="tasks-page">
            <div className="page-header">
                <h1>Tasks</h1>
                <p>Manage your recurring and one-time tasks</p>
            </div>

            <div className="tasks-toolbar">
                <div className="filter-pills">
                    <button className={`pill ${filterCat === 'All' ? 'active' : ''}`} onClick={() => setFilterCat('All')}>
                        <Filter size={14} /> All ({tasks.length})
                    </button>
                    {CATEGORIES.map((c) => (
                        <button key={c} className={`pill ${filterCat === c ? 'active' : ''} ${categoryClass[c]}`} onClick={() => setFilterCat(c)}>
                            {c} ({tasks.filter((t) => t.category === c).length})
                        </button>
                    ))}
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={16} /> New Task
                </button>
            </div>

            {error && <div className="tasks-error card">{error} <button onClick={() => setError(null)}>Dismiss</button></div>}

            {showForm && (
                <div className="task-form card stagger">
                    <h3>Create Task</h3>
                    <div className="form-grid">
                        <div className="form-field">
                            <label>Name</label>
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Brush Teeth" />
                        </div>
                        <div className="form-field">
                            <label>Category</label>
                            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Period</label>
                            <select value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)}>
                                {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Occurrence</label>
                            <input type="text" value={newOccurrence} onChange={(e) => setNewOccurrence(e.target.value)} placeholder="e.g. Mon,Wed,Fri" />
                        </div>
                        <div className="form-field">
                            <label>Duration (min)</label>
                            <input type="number" value={newTime} onChange={(e) => setNewTime(Number(e.target.value))} min={1} />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={handleCreate}>Create</button>
                        <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="tasks-loading">Loading tasks…</div>
            ) : (
                <div className="tasks-list stagger">
                    {filtered.length === 0 && <div className="tasks-empty card">No tasks found. Create one above!</div>}
                    {filtered.map((task) => (
                        <div key={task.id} className="task-card card">
                            <div className="task-card-left">
                                <div className={`task-cat-indicator ${categoryClass[task.category]}`} />
                                <div className="task-card-info">
                                    <h4>{task.name}</h4>
                                    <div className="task-card-meta">
                                        <span className={`cat-badge ${categoryClass[task.category]}`}>{task.category}</span>
                                        <span className="task-period">{periodLabel(task.recurrence_rule)}</span>
                                        {task.base_time_minutes && <span className="task-duration">{task.base_time_minutes} min</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="task-card-right">
                                <span className="task-code">{task.task_code}</span>
                                <button className="btn btn-ghost btn-danger" onClick={() => handleDelete(task.id)} title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
