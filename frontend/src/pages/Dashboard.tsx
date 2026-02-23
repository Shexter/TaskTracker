import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { CheckCircle2, Clock, TrendingUp, CalendarDays, ArrowRight } from 'lucide-react';
import { getDashboardMetrics } from '../api/dashboard';
import type { DashboardMetrics } from '../types';
import { format } from 'date-fns';
import './Dashboard.css';

export default function Dashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDashboardMetrics()
            .then(setMetrics)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="page-header"><h1>Dashboard</h1><p>Loading your metrics...</p></div>
            </div>
        );
    }
    if (error || !metrics) {
        return (
            <div className="dashboard-page">
                <div className="page-header"><h1>Dashboard</h1><p className="error">Error: {error}</p></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Tasks', value: metrics.totalTasks, icon: <CheckCircle2 size={20} />, color: 'var(--cat-health)' },
        { label: 'Completion', value: `${metrics.completionRate}%`, icon: <TrendingUp size={20} />, color: 'var(--cat-bills)' },
        { label: 'Hours', value: `${metrics.hoursScheduled}h`, icon: <Clock size={20} />, color: 'var(--cat-taxes)' },
        { label: 'Busiest Day', value: metrics.busiestDay, icon: <CalendarDays size={20} />, color: 'var(--cat-work)' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>{format(new Date(), 'MMMM yyyy')} Overview</p>
            </div>

            <div className="dashboard-stats stagger">
                {statCards.map((card, i) => (
                    <div key={i} className="stat-card card">
                        <div className="stat-icon" style={{ background: `hsla(${card.color}, 0.15)`, color: `hsl(${card.color})` }}>
                            {card.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{card.value}</span>
                            <span className="stat-label">{card.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-charts">
                <div className="chart-card card">
                    <h3>Weekly Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={metrics.weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 18%)" />
                            <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                            <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                            <Tooltip contentStyle={{ background: 'hsl(222, 44%, 10%)', border: '1px solid hsl(215, 25%, 18%)', borderRadius: 8 }} />
                            <Bar dataKey="completed" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pending" fill="hsl(215, 20%, 55%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card card">
                    <h3>By Category</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={metrics.tasksByCategory} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} strokeWidth={2} stroke="hsl(222, 47%, 7%)">
                                {metrics.tasksByCategory.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: 'hsl(222, 44%, 10%)', border: '1px solid hsl(215, 25%, 18%)', borderRadius: 8 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-legend">
                        {metrics.tasksByCategory.map((cat, i) => (
                            <div key={i} className="legend-item">
                                <span className="legend-dot" style={{ background: cat.color }} />
                                <span>{cat.name}</span>
                                <span className="legend-count">{cat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="dashboard-upcoming card">
                <div className="upcoming-header">
                    <h3>Upcoming Tasks</h3>
                    <ArrowRight size={16} />
                </div>
                <div className="upcoming-list stagger">
                    {metrics.upcomingTasks.length === 0 && <p className="upcoming-empty">No upcoming tasks 🎉</p>}
                    {metrics.upcomingTasks.map((inst) => (
                        <div key={inst.id} className="upcoming-item">
                            <div className="upcoming-dot" style={{ background: `hsl(var(--cat-${(inst.task?.category || '').toLowerCase()}))` }} />
                            <div className="upcoming-info">
                                <span className="upcoming-name">{inst.task?.name}</span>
                                <span className="upcoming-date">{format(new Date(inst.occurrence_date), 'EEE, MMM d')}</span>
                            </div>
                            <span className={`status-badge status-${inst.status.toLowerCase()}`}>{inst.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
