import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getMonthInstances } from '../api/calendar';
import { getHolidays } from '../api/holidays';
import type { TaskInstance, Holiday } from '../types';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, getDay } from 'date-fns';
import './Calendar.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const categoryClass: Record<string, string> = {
    Health: 'cat-health', Bills: 'cat-bills', Taxes: 'cat-taxes',
    Work: 'cat-work', Personal: 'cat-personal',
};

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [instances, setInstances] = useState<TaskInstance[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const dateStr = format(currentMonth, 'yyyy-MM-dd');
        Promise.all([getMonthInstances(dateStr), getHolidays()])
            .then(([inst, hol]) => { setInstances(inst); setHolidays(hol); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [currentMonth]);

    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const startPad = getDay(start);

    const goToToday = () => setCurrentMonth(new Date());

    const instancesByDate = useMemo(() => {
        const map: Record<string, TaskInstance[]> = {};
        for (const inst of instances) {
            const d = inst.occurrence_date;
            if (!map[d]) map[d] = [];
            map[d].push(inst);
        }
        return map;
    }, [instances]);

    const holidaysByDate = useMemo(() => {
        const map: Record<string, Holiday> = {};
        for (const h of holidays) map[h.holiday_date] = h;
        return map;
    }, [holidays]);

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    return (
        <div className="calendar-page">
            <div className="page-header">
                <h1>Calendar</h1>
                <p>Month view of your scheduled tasks</p>
            </div>

            <div className="calendar-controls">
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="calendar-month-label">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <button className="btn btn-ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight size={18} />
                    </button>
                </div>
                <button className="btn btn-secondary" onClick={goToToday}>Today</button>
            </div>

            <div className="calendar-grid card">
                <div className="calendar-weekday-row">
                    {WEEKDAYS.map((d) => <div key={d} className="calendar-weekday">{d}</div>)}
                </div>

                <div className="calendar-days">
                    {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} className="calendar-day empty" />)}

                    {days.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const dayInstances = instancesByDate[dateStr] || [];
                        const holiday = holidaysByDate[dateStr];
                        const isToday = dateStr === todayStr;

                        return (
                            <div key={dateStr} className={`calendar-day ${isToday ? 'today' : ''}`}>
                                <span className={`day-number ${isToday ? 'today-num' : ''}`}>{day.getDate()}</span>
                                {holiday && (
                                    <div className="day-holiday" title={holiday.name}>
                                        <Star size={10} /> {holiday.name.length > 8 ? holiday.name.slice(0, 8) + '…' : holiday.name}
                                    </div>
                                )}
                                <div className="day-tasks">
                                    {dayInstances.slice(0, 3).map((inst) => (
                                        <div key={inst.id} className={`day-task-chip ${categoryClass[inst.task?.category || '']}`}>
                                            {inst.task?.name || 'Task'}
                                        </div>
                                    ))}
                                    {dayInstances.length > 3 && <span className="day-more">+{dayInstances.length - 3}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {loading && <div className="calendar-loading">Loading…</div>}
        </div>
    );
}
