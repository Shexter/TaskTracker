import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    CheckCircle2,
    Clock,
    TrendingUp,
    CalendarDays,
    ArrowRight,
} from 'lucide-react';
import {
    mockTasks,
    expandTaskInstances,
    computeMetrics,
    format,
} from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
    const metrics = useMemo(() => {
        const now = new Date();
        const instances = expandTaskInstances(mockTasks, now);
        return computeMetrics(mockTasks, instances);
    }, []);

    const metricCards = [
        {
            label: 'Total Tasks',
            value: metrics.totalTasks,
            icon: <CalendarDays size={22} />,
            accent: 'var(--accent)',
            change: '+8 this week',
        },
        {
            label: 'Completion Rate',
            value: `${metrics.completionRate}%`,
            icon: <CheckCircle2 size={22} />,
            accent: 'hsl(var(--status-completed))',
            change: '↑ 5% from last month',
        },
        {
            label: 'Hours Scheduled',
            value: `${metrics.hoursScheduled}h`,
            icon: <Clock size={22} />,
            accent: 'hsl(var(--cat-work))',
            change: `${mockTasks.length} active tasks`,
        },
        {
            label: 'Busiest Day',
            value: metrics.busiestDay,
            icon: <TrendingUp size={22} />,
            accent: 'hsl(var(--cat-taxes))',
            change: `Peak productivity day`,
        },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of your task management metrics</p>
            </div>

            {/* Metric Cards - Bento Grid */}
            <div className="metrics-grid stagger">
                {metricCards.map((card, i) => (
                    <div key={i} className="metric-card card">
                        <div className="metric-card-header">
                            <span className="metric-icon" style={{ color: card.accent }}>
                                {card.icon}
                            </span>
                            <span className="metric-label">{card.label}</span>
                        </div>
                        <div className="metric-value">{card.value}</div>
                        <div className="metric-change">{card.change}</div>
                        <div
                            className="metric-glow"
                            style={{ background: card.accent }}
                        />
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Weekly Distribution */}
                <div className="chart-card card">
                    <h3 className="chart-title">Weekly Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={metrics.weeklyData} barGap={4}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsla(215, 25%, 18%, 0.5)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'hsl(222, 44%, 12%)',
                                        border: '1px solid hsl(215, 25%, 20%)',
                                        borderRadius: '10px',
                                        color: 'hsl(210, 40%, 96%)',
                                        fontSize: '13px',
                                    }}
                                />
                                <Bar
                                    dataKey="completed"
                                    fill="hsl(142, 71%, 45%)"
                                    radius={[6, 6, 0, 0]}
                                    name="Completed"
                                />
                                <Bar
                                    dataKey="pending"
                                    fill="hsl(215, 20%, 40%)"
                                    radius={[6, 6, 0, 0]}
                                    name="Pending"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="chart-card card">
                    <h3 className="chart-title">By Category</h3>
                    <div className="chart-container pie-chart-wrapper">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={metrics.tasksByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="count"
                                >
                                    {metrics.tasksByCategory.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'hsl(222, 44%, 12%)',
                                        border: '1px solid hsl(215, 25%, 20%)',
                                        borderRadius: '10px',
                                        color: 'hsl(210, 40%, 96%)',
                                        fontSize: '13px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-legend">
                            {metrics.tasksByCategory.map((cat, i) => (
                                <div key={i} className="pie-legend-item">
                                    <span
                                        className="pie-legend-dot"
                                        style={{ background: cat.color }}
                                    />
                                    <span className="pie-legend-label">{cat.name}</span>
                                    <span className="pie-legend-count">{cat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="upcoming-card card">
                <div className="upcoming-header">
                    <h3 className="chart-title">Upcoming Tasks</h3>
                    <span className="upcoming-badge">{metrics.upcomingTasks.length} pending</span>
                </div>
                <div className="upcoming-list stagger">
                    {metrics.upcomingTasks.map((inst) => (
                        <div key={inst.id} className="upcoming-item">
                            <div
                                className="upcoming-dot"
                                style={{
                                    background: inst.task
                                        ? `hsl(var(--cat-${inst.task.category.toLowerCase()}))`
                                        : 'hsl(var(--text-tertiary))',
                                }}
                            />
                            <div className="upcoming-info">
                                <span className="upcoming-name">
                                    {inst.task?.name || 'Unknown'}
                                </span>
                                <span className="upcoming-meta">
                                    {inst.task?.category} · {inst.task?.base_time_minutes} min
                                </span>
                            </div>
                            <span className="upcoming-date">
                                {format(new Date(inst.occurrence_date), 'MMM d')}
                            </span>
                            <ArrowRight size={14} className="upcoming-arrow" />
                        </div>
                    ))}
                    {metrics.upcomingTasks.length === 0 && (
                        <div className="upcoming-empty">No upcoming tasks 🎉</div>
                    )}
                </div>
            </div>
        </div>
    );
}
