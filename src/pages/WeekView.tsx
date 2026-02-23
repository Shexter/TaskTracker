import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';
import {
    mockTasks,
    mockHolidays,
    expandTaskInstancesForWeek,
    format,
    startOfWeek,
    type TaskInstance,
    type Task,
} from '../data/mockData';
import { addDays, subDays, isToday, isSameDay } from 'date-fns';
import './WeekView.css';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM – 10 PM
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const categoryClass: Record<string, string> = {
    Health: 'cat-health',
    Bills: 'cat-bills',
    Taxes: 'cat-taxes',
    Work: 'cat-work',
    Personal: 'cat-personal',
};

// Assign mock start hours to tasks for visual placement
function assignMockHour(task: Task, dayIndex: number): number {
    const nameHash = task.name.split('').reduce((h, c) => h + c.charCodeAt(0), 0);
    return 6 + ((nameHash + dayIndex * 3) % 15); // 6 AM – 8 PM
}

export default function WeekView() {
    const [weekDate, setWeekDate] = useState(new Date());
    const [quickAdd, setQuickAdd] = useState<{ day: number; hour: number } | null>(null);
    const [quickAddName, setQuickAddName] = useState('');
    const [localTasks, setLocalTasks] = useState<Task[]>(mockTasks);

    const weekStart = startOfWeek(weekDate, { weekStartsOn: 0 });

    const weekDays = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart.toISOString()]
    );

    const instances = useMemo(
        () => expandTaskInstancesForWeek(localTasks, weekDate),
        [weekDate, localTasks]
    );

    // Group instances by day index and hour
    const grid = useMemo(() => {
        const map: Record<string, TaskInstance[]> = {};
        for (const inst of instances) {
            const instDate = new Date(inst.occurrence_date);
            const dayIdx = weekDays.findIndex((d) => isSameDay(d, instDate));
            if (dayIdx === -1) continue;
            const hour = assignMockHour(inst.task!, dayIdx);
            const key = `${dayIdx}-${hour}`;
            if (!map[key]) map[key] = [];
            map[key].push(inst);
        }
        return map;
    }, [instances, weekDays]);

    // Holiday map for the week
    const holidayMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const h of mockHolidays) {
            map[h.holiday_date] = h.name;
        }
        return map;
    }, []);

    const handleQuickAdd = () => {
        if (!quickAddName.trim() || !quickAdd) return;
        const targetDay = weekDays[quickAdd.day];
        const newTask: Task = {
            id: `t-${Date.now()}`,
            user_id: 'u-001',
            task_id: `T${String(localTasks.length + 1).padStart(3, '0')}`,
            name: quickAddName.trim(),
            category: 'Personal',
            period: 'OneTime',
            occurrence: format(targetDay, 'MMM d'),
            base_time_minutes: 30,
            status: 'Active',
            created_at: new Date().toISOString(),
        };
        setLocalTasks((prev) => [...prev, newTask]);
        setQuickAdd(null);
        setQuickAddName('');
    };

    const goToThisWeek = () => setWeekDate(new Date());

    return (
        <div className="weekview-page">
            <div className="page-header">
                <h1>Week View</h1>
                <p>7-day schedule with hourly time slots</p>
            </div>

            {/* Controls */}
            <div className="weekview-controls">
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setWeekDate(subDays(weekDate, 7))}>
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="weekview-range">
                        {format(weekDays[0], 'MMM d')} – {format(weekDays[6], 'MMM d, yyyy')}
                    </h2>
                    <button className="btn btn-ghost" onClick={() => setWeekDate(addDays(weekDate, 7))}>
                        <ChevronRight size={18} />
                    </button>
                </div>
                <button className="btn btn-secondary" onClick={goToThisWeek}>
                    This Week
                </button>
            </div>

            {/* Time Grid */}
            <div className="weekview-grid-wrapper">
                <div className="weekview-grid">
                    {/* Header row */}
                    <div className="grid-corner" />
                    {weekDays.map((day, i) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const holiday = holidayMap[dateStr];
                        const today = isToday(day);
                        return (
                            <div key={i} className={`grid-day-header ${today ? 'today' : ''}`}>
                                <span className="grid-day-name">{WEEKDAYS[i]}</span>
                                <span className={`grid-day-num ${today ? 'today-badge' : ''}`}>
                                    {day.getDate()}
                                </span>
                                {holiday && <span className="grid-holiday-tag">{holiday}</span>}
                            </div>
                        );
                    })}

                    {/* Hour rows */}
                    {HOURS.map((hour) => {
                        const timeLabel = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
                        const isCurrentHour = isToday(weekDays.find((d) => isToday(d)) || new Date()) && new Date().getHours() === hour;

                        return (
                            <>
                                <div key={`time-${hour}`} className={`grid-time-label ${isCurrentHour ? 'now' : ''}`}>
                                    {timeLabel}
                                </div>
                                {weekDays.map((_, dayIdx) => {
                                    const key = `${dayIdx}-${hour}`;
                                    const cellTasks = grid[key] || [];
                                    const isQuickAddCell = quickAdd?.day === dayIdx && quickAdd?.hour === hour;

                                    return (
                                        <div
                                            key={`cell-${dayIdx}-${hour}`}
                                            className={`grid-cell ${isCurrentHour && isToday(weekDays[dayIdx]) ? 'now-cell' : ''}`}
                                            onClick={() => {
                                                if (cellTasks.length === 0 && !isQuickAddCell) {
                                                    setQuickAdd({ day: dayIdx, hour });
                                                    setQuickAddName('');
                                                }
                                            }}
                                        >
                                            {cellTasks.map((inst) => (
                                                <div
                                                    key={inst.id}
                                                    className={`week-task-block ${categoryClass[inst.task?.category || '']}`}
                                                >
                                                    <span className="block-name">{inst.task?.name}</span>
                                                    <span className="block-time">
                                                        <Clock size={10} />
                                                        {inst.task?.base_time_minutes}m
                                                    </span>
                                                </div>
                                            ))}

                                            {/* Quick Add Inline Form */}
                                            {isQuickAddCell && (
                                                <div className="quick-add-form" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        autoFocus
                                                        className="quick-add-input"
                                                        placeholder="Task name..."
                                                        value={quickAddName}
                                                        onChange={(e) => setQuickAddName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleQuickAdd();
                                                            if (e.key === 'Escape') setQuickAdd(null);
                                                        }}
                                                    />
                                                    <button className="quick-add-btn" onClick={handleQuickAdd}>
                                                        <Plus size={14} />
                                                    </button>
                                                    <button className="quick-add-close" onClick={() => setQuickAdd(null)}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
