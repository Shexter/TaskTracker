import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { getMonthInstances } from '../api/calendar';
import { getHolidays } from '../api/holidays';
import type { TaskInstance, Holiday } from '../types';
import { addDays, subDays, isToday, format } from 'date-fns';
import './DayView.css';

const categoryClass: Record<string, string> = {
    Health: 'cat-health', Bills: 'cat-bills', Taxes: 'cat-taxes',
    Work: 'cat-work', Personal: 'cat-personal',
};

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

export default function DayView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [instances, setInstances] = useState<TaskInstance[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);

    useEffect(() => {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        Promise.all([getMonthInstances(dateStr), getHolidays()])
            .then(([inst, hol]) => { setInstances(inst); setHolidays(hol); })
            .catch(console.error);
    }, [currentDate]);

    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayInstances = instances.filter((i) => i.occurrence_date === dateStr);
    const holiday = holidays.find((h) => h.holiday_date === dateStr);

    const taskSlots = useMemo(() => {
        const slots: Record<number, TaskInstance[]> = {};
        dayInstances.forEach((inst, index) => {
            const hour = 7 + (index * 2) % 12;
            if (!slots[hour]) slots[hour] = [];
            slots[hour].push(inst);
        });
        return slots;
    }, [dayInstances]);

    const completed = dayInstances.filter((i) => i.status === 'Completed').length;
    const totalMinutes = dayInstances.reduce((sum, i) => sum + (i.task?.base_time_minutes || 0), 0);

    return (
        <div className="dayview-page">
            <div className="page-header"><h1>Day View</h1><p>Hourly schedule for the selected day</p></div>

            <div className="dayview-controls">
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setCurrentDate(subDays(currentDate, 1))}><ChevronLeft size={18} /></button>
                    <h2 className="dayview-date-label">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
                    <button className="btn btn-ghost" onClick={() => setCurrentDate(addDays(currentDate, 1))}><ChevronRight size={18} /></button>
                </div>
                <div className="dayview-actions">
                    {isToday(currentDate) && <span className="today-pill">Today</span>}
                    <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date())}>Today</button>
                </div>
            </div>

            <div className="dayview-layout">
                <div className="dayview-summary card">
                    <h3 className="summary-title">Day Summary</h3>
                    {holiday && <div className="summary-holiday">🎉 {holiday.name}</div>}
                    <div className="summary-stats">
                        <div className="summary-stat"><span className="summary-stat-value">{dayInstances.length}</span><span className="summary-stat-label">Tasks</span></div>
                        <div className="summary-stat"><span className="summary-stat-value">{completed}</span><span className="summary-stat-label">Completed</span></div>
                        <div className="summary-stat"><span className="summary-stat-value">{totalMinutes}m</span><span className="summary-stat-label">Total</span></div>
                    </div>
                    <div className="summary-tasks stagger">
                        {dayInstances.map((inst) => (
                            <div key={inst.id} className="summary-task-item">
                                <div className="summary-task-dot" style={{ background: `hsl(var(--cat-${(inst.task?.category || '').toLowerCase()}))` }} />
                                <div className="summary-task-info">
                                    <span className="summary-task-name">{inst.task?.name}</span>
                                    <span className="summary-task-meta">{inst.task?.base_time_minutes} min</span>
                                </div>
                                {inst.status === 'Completed' ? <CheckCircle2 size={16} className="summary-check done" /> : <div className="summary-check pending" />}
                            </div>
                        ))}
                        {dayInstances.length === 0 && <div className="summary-empty">No tasks scheduled</div>}
                    </div>
                </div>

                <div className="dayview-timeline card">
                    {HOURS.map((hour) => {
                        const tasks = taskSlots[hour] || [];
                        const timeLabel = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                        const isNow = isToday(currentDate) && new Date().getHours() === hour;
                        return (
                            <div key={hour} className={`timeline-row ${isNow ? 'now' : ''}`}>
                                <div className="timeline-time"><span>{timeLabel}</span></div>
                                <div className="timeline-line">
                                    <div className="timeline-dot" />
                                    {isNow && <div className="timeline-now-indicator" />}
                                </div>
                                <div className="timeline-content">
                                    {tasks.map((inst) => (
                                        <div key={inst.id} className={`timeline-task ${categoryClass[inst.task?.category || '']}`}>
                                            <div className="timeline-task-header">
                                                <span className="timeline-task-name">{inst.task?.name}</span>
                                                <span className={`status-badge status-${inst.status.toLowerCase()}`}>{inst.status}</span>
                                            </div>
                                            <div className="timeline-task-meta">
                                                <Clock size={12} /><span>{inst.task?.base_time_minutes} min</span>
                                                <span className="timeline-task-cat">{inst.task?.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
