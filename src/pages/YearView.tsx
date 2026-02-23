import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import {
    mockTasks,
    mockHolidays,
    expandTaskInstances,
    format,
    monthlyStatusMap,
    SEASONALITY_MULTIPLIERS,
    SEASONALITY_LABELS,
} from '../data/mockData';
import { eachDayOfInterval, startOfMonth, endOfMonth, getDay, isToday } from 'date-fns';
import './YearView.css';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function YearView() {
    const [year, setYear] = useState(new Date().getFullYear());

    // Expand instances for all 12 months
    const yearData = useMemo(() => {
        const data: Record<string, { count: number; dominant: string }> = {};
        for (let month = 0; month < 12; month++) {
            const monthDate = new Date(year, month, 1);
            const instances = expandTaskInstances(mockTasks, monthDate);
            for (const inst of instances) {
                if (!data[inst.occurrence_date]) {
                    data[inst.occurrence_date] = { count: 0, dominant: '' };
                }
                data[inst.occurrence_date].count += 1;
                if (inst.task?.category) {
                    data[inst.occurrence_date].dominant = inst.task.category;
                }
            }
        }
        return data;
    }, [year]);

    // Holiday set
    const holidaySet = useMemo(() => {
        const set = new Set<string>();
        for (const h of mockHolidays) {
            if (h.holiday_date.startsWith(String(year))) {
                set.add(h.holiday_date);
            }
        }
        return set;
    }, [year]);

    // Monthly aggregates
    const monthStats = useMemo(() => {
        return MONTHS.map((_, month) => {
            const monthDate = new Date(year, month, 1);
            const instances = expandTaskInstances(mockTasks, monthDate);
            const completed = instances.filter((i) => i.status === 'Completed').length;
            return {
                total: instances.length,
                completed,
                rate: instances.length > 0 ? Math.round((completed / instances.length) * 100) : 0,
            };
        });
    }, [year]);

    const getHeatLevel = (count: number): number => {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 4) return 2;
        if (count <= 6) return 3;
        return 4;
    };

    return (
        <div className="yearview-page">
            <div className="page-header">
                <h1>Year View</h1>
                <p>Annual overview of your task activity</p>
            </div>

            {/* Controls */}
            <div className="yearview-controls">
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setYear(year - 1)}>
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="yearview-year-label">{year}</h2>
                    <button className="btn btn-ghost" onClick={() => setYear(year + 1)}>
                        <ChevronRight size={18} />
                    </button>
                </div>
                <button className="btn btn-secondary" onClick={() => setYear(new Date().getFullYear())}>
                    This Year
                </button>
            </div>

            {/* Heat Legend */}
            <div className="heat-legend">
                <span className="heat-legend-label">Less</span>
                <div className="heat-square" data-level="0" />
                <div className="heat-square" data-level="1" />
                <div className="heat-square" data-level="2" />
                <div className="heat-square" data-level="3" />
                <div className="heat-square" data-level="4" />
                <span className="heat-legend-label">More</span>
            </div>

            {/* Month Grid */}
            <div className="yearview-grid">
                {MONTHS.map((monthName, monthIdx) => {
                    const monthDate = new Date(year, monthIdx, 1);
                    const days = eachDayOfInterval({
                        start: startOfMonth(monthDate),
                        end: endOfMonth(monthDate),
                    });
                    const startDow = getDay(days[0]);
                    const stats = monthStats[monthIdx];

                    const seasonStatus = monthlyStatusMap[monthIdx];
                    const multiplier = SEASONALITY_MULTIPLIERS[seasonStatus];
                    const seasonLabel = SEASONALITY_LABELS[seasonStatus];

                    return (
                        <div key={monthIdx} className={`yearview-month card season-${seasonStatus.toLowerCase()}`}>
                            <div className="month-header">
                                <div className="month-name-row">
                                    <span className="month-name">{monthName}</span>
                                    {seasonStatus !== 'N' && (
                                        <span className={`season-badge season-${seasonStatus.toLowerCase()}`}>
                                            {seasonStatus === 'P' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                            {seasonLabel}
                                        </span>
                                    )}
                                </div>
                                <div className="month-stats">
                                    {stats.total > 0 && (
                                        <span className="month-rate" data-good={stats.rate >= 70}>
                                            {stats.rate}%
                                        </span>
                                    )}
                                    {multiplier !== 1.0 && (
                                        <span className="month-multiplier">{multiplier}×</span>
                                    )}
                                </div>
                            </div>

                            {/* Weekday headers */}
                            <div className="mini-weekdays">
                                {WEEKDAY_LETTERS.map((d, i) => (
                                    <span key={i} className="mini-weekday">{d}</span>
                                ))}
                            </div>

                            {/* Day cells */}
                            <div className="mini-calendar">
                                {/* Empty padding */}
                                {Array(startDow).fill(null).map((_, i) => (
                                    <div key={`pad-${i}`} className="mini-day empty" />
                                ))}

                                {days.map((day) => {
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const dayData = yearData[dateStr];
                                    const count = dayData?.count || 0;
                                    const heatLevel = getHeatLevel(count);
                                    const isHoliday = holidaySet.has(dateStr);
                                    const today = isToday(day);

                                    return (
                                        <div
                                            key={dateStr}
                                            className={`mini-day ${today ? 'today' : ''} ${isHoliday ? 'holiday' : ''}`}
                                            data-level={heatLevel}
                                            title={`${format(day, 'MMM d')}: ${count} tasks${isHoliday ? ' (Holiday)' : ''}`}
                                        />
                                    );
                                })}
                            </div>

                            <div className="month-footer">
                                <span className="month-total">{stats.total} tasks</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
