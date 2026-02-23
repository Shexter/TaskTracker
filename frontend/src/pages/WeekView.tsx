import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';
import { getWeekInstances } from '../api/calendar';
import { getHolidays } from '../api/holidays';
import type { TaskInstance, Holiday } from '../types';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import './WeekView.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const categoryClass: Record<string, string> = {
    Health: 'cat-health', Bills: 'cat-bills', Taxes: 'cat-taxes',
    Work: 'cat-work', Personal: 'cat-personal',
};

function assignMockHour(taskName: string, dayIndex: number): number {
    const hash = (taskName.length * 7 + dayIndex * 13) % 14;
    return 6 + hash;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

export default function WeekView() {
    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
    const [instances, setInstances] = useState<TaskInstance[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [quickAdd, setQuickAdd] = useState<{ day: number; hour: number } | null>(null);
    const [quickAddName, setQuickAddName] = useState('');

    useEffect(() => {
        const dateStr = format(weekStart, 'yyyy-MM-dd');
        Promise.all([getWeekInstances(dateStr), getHolidays()])
            .then(([inst, hol]) => { setInstances(inst); setHolidays(hol); })
            .catch(console.error);
    }, [weekStart]);

    const weekDays = useMemo(() =>
        Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

    const instancesByDay = useMemo(() => {
        const map: Record<string, TaskInstance[]> = {};
        for (const inst of instances) {
            if (!map[inst.occurrence_date]) map[inst.occurrence_date] = [];
            map[inst.occurrence_date].push(inst);
        }
        return map;
    }, [instances]);

    const holidaysByDate = useMemo(() => {
        const map: Record<string, Holiday> = {};
        for (const h of holidays) map[h.holiday_date] = h;
        return map;
    }, [holidays]);

    const handleQuickAdd = () => {
        if (!quickAddName.trim() || !quickAdd) return;
        // TODO: call createTask API when quick-add is fully implemented
        setQuickAdd(null);
        setQuickAddName('');
    };

    const goToThisWeek = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    return (
        <div className="weekview-page">
            <div className="page-header"><h1>Week View</h1><p>7-day timeline with your tasks</p></div>

            <div className="weekview-controls">
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setWeekStart(subWeeks(weekStart, 1))}><ChevronLeft size={18} /></button>
                    <h2 className="weekview-range">{format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}</h2>
                    <button className="btn btn-ghost" onClick={() => setWeekStart(addWeeks(weekStart, 1))}><ChevronRight size={18} /></button>
                </div>
                <button className="btn btn-secondary" onClick={goToThisWeek}>This Week</button>
            </div>

            <div className="weekview-grid card">
                <div className="weekview-header-row">
                    <div className="weekview-time-col" />
                    {weekDays.map((day, i) => {
                        const dStr = format(day, 'yyyy-MM-dd');
                        const holiday = holidaysByDate[dStr];
                        const isToday = dStr === todayStr;
                        return (
                            <div key={i} className={`weekview-day-header ${isToday ? 'today' : ''}`}>
                                <span className="weekview-day-name">{WEEKDAYS[i]}</span>
                                <span className={`weekview-day-num ${isToday ? 'today-num' : ''}`}>{day.getDate()}</span>
                                {holiday && <span className="weekview-holiday-badge" title={holiday.name}>🎉</span>}
                            </div>
                        );
                    })}
                </div>

                <div className="weekview-body">
                    {HOURS.map((hour) => (
                        <div key={hour} className="weekview-hour-row">
                            <div className="weekview-time-label">
                                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                            </div>
                            {weekDays.map((day, dayIdx) => {
                                const dStr = format(day, 'yyyy-MM-dd');
                                const dayInsts = instancesByDay[dStr] || [];
                                const hourTasks = dayInsts.filter((inst) =>
                                    assignMockHour(inst.task?.name || '', dayIdx) === hour
                                );
                                const isQuickAddCell = quickAdd?.day === dayIdx && quickAdd?.hour === hour;

                                return (
                                    <div key={dayIdx} className="weekview-cell" onClick={() => !quickAdd && setQuickAdd({ day: dayIdx, hour })}>
                                        {hourTasks.map((inst) => (
                                            <div key={inst.id} className={`weekview-task-block ${categoryClass[inst.task?.category || '']}`}>
                                                <span className="block-name">{inst.task?.name}</span>
                                                <span className="block-time"><Clock size={10} /> {inst.task?.base_time_minutes}m</span>
                                            </div>
                                        ))}
                                        {isQuickAddCell && (
                                            <div className="quick-add-form" onClick={(e) => e.stopPropagation()}>
                                                <input autoFocus placeholder="Task name…" value={quickAddName} onChange={(e) => setQuickAddName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()} />
                                                <div className="quick-add-actions">
                                                    <button className="btn btn-primary btn-sm" onClick={handleQuickAdd}><Plus size={14} /></button>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => setQuickAdd(null)}><X size={14} /></button>
                                                </div>
                                            </div>
                                        )}
                                        {hourTasks.length === 0 && !isQuickAddCell && <div className="weekview-cell-empty" />}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
