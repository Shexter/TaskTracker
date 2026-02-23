import { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Star,
} from 'lucide-react';
import {
    mockTasks,
    mockHolidays,
    expandTaskInstances,
    format,
    startOfMonth,
    endOfMonth,
    addMonths,
    subMonths,
    type TaskInstance,
} from '../data/mockData';
import { eachDayOfInterval, getDay, isToday, isSameMonth } from 'date-fns';
import './Calendar.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const categoryClass: Record<string, string> = {
    Health: 'cat-health',
    Bills: 'cat-bills',
    Taxes: 'cat-taxes',
    Work: 'cat-work',
    Personal: 'cat-personal',
};

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const instances = useMemo(
        () => expandTaskInstances(mockTasks, currentMonth),
        [currentMonth]
    );

    // Build the calendar grid
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // Pad start with empty cells for alignment
        const startDow = getDay(monthStart);
        const paddedDays: (Date | null)[] = Array(startDow).fill(null).concat(days);

        // Pad end to complete the last row
        while (paddedDays.length % 7 !== 0) {
            paddedDays.push(null);
        }

        return paddedDays;
    }, [currentMonth]);

    // Group instances by date
    const instancesByDate = useMemo(() => {
        const map: Record<string, TaskInstance[]> = {};
        for (const inst of instances) {
            if (!map[inst.occurrence_date]) map[inst.occurrence_date] = [];
            map[inst.occurrence_date].push(inst);
        }
        return map;
    }, [instances]);

    // Holiday map
    const holidayMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const h of mockHolidays) {
            map[h.holiday_date] = h.name;
        }
        return map;
    }, []);

    const goToToday = () => setCurrentMonth(new Date());

    // Selected date details panel
    const selectedInstances = selectedDate ? instancesByDate[selectedDate] || [] : [];
    const selectedHoliday = selectedDate ? holidayMap[selectedDate] : null;

    return (
        <div className="calendar-page">
            <div className="page-header">
                <h1>Calendar</h1>
                <p>Month view of your scheduled tasks</p>
            </div>

            {/* Controls */}
            <div className="calendar-controls">
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="calendar-month-label">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <button className="btn btn-ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight size={18} />
                    </button>
                </div>
                <button className="btn btn-secondary" onClick={goToToday}>
                    Today
                </button>
            </div>

            <div className="calendar-layout">
                {/* Calendar Grid */}
                <div className="calendar-grid-wrapper">
                    {/* Weekday headers */}
                    <div className="calendar-weekdays">
                        {WEEKDAYS.map((day) => (
                            <div key={day} className="weekday-header">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Day cells */}
                    <div className="calendar-grid">
                        {calendarDays.map((day, i) => {
                            if (!day) {
                                return <div key={`empty-${i}`} className="calendar-cell empty" />;
                            }

                            const dateStr = format(day, 'yyyy-MM-dd');
                            const dayInstances = instancesByDate[dateStr] || [];
                            const holiday = holidayMap[dateStr];
                            const today = isToday(day);
                            const isSelected = selectedDate === dateStr;
                            const inMonth = isSameMonth(day, currentMonth);

                            return (
                                <div
                                    key={dateStr}
                                    className={`calendar-cell ${today ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!inMonth ? 'outside' : ''}`}
                                    onClick={() => setSelectedDate(dateStr)}
                                >
                                    <div className="cell-header">
                                        <span className={`cell-date ${today ? 'today-badge' : ''}`}>
                                            {day.getDate()}
                                        </span>
                                        {holiday && (
                                            <Star size={12} className="cell-holiday-icon" />
                                        )}
                                    </div>
                                    {holiday && (
                                        <div className="cell-holiday">{holiday}</div>
                                    )}
                                    <div className="cell-tasks">
                                        {dayInstances.slice(0, 3).map((inst) => (
                                            <div
                                                key={inst.id}
                                                className={`cell-task-chip ${categoryClass[inst.task?.category || ''] || ''}`}
                                            >
                                                <span className="chip-name">{inst.task?.name}</span>
                                            </div>
                                        ))}
                                        {dayInstances.length > 3 && (
                                            <div className="cell-more">
                                                +{dayInstances.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detail Panel */}
                {selectedDate && (
                    <div className="calendar-detail glass-strong animate-slide-in">
                        <h3 className="detail-date">
                            {format(new Date(selectedDate), 'EEEE, MMMM d')}
                        </h3>
                        {selectedHoliday && (
                            <div className="detail-holiday">
                                <Star size={14} />
                                <span>{selectedHoliday}</span>
                            </div>
                        )}
                        {selectedInstances.length > 0 ? (
                            <div className="detail-tasks">
                                {selectedInstances.map((inst) => (
                                    <div key={inst.id} className="detail-task-item">
                                        <div className={`detail-task-badge ${categoryClass[inst.task?.category || '']}`}>
                                            {inst.task?.category}
                                        </div>
                                        <div className="detail-task-name">{inst.task?.name}</div>
                                        <div className="detail-task-meta">
                                            {inst.task?.base_time_minutes} min · {inst.task?.period}
                                        </div>
                                        <div className={`status-badge status-${inst.status.toLowerCase().replace(' ', '-')}`}>
                                            {inst.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="detail-empty">No tasks on this day</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
