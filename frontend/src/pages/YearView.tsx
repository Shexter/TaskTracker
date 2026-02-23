import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getMonthInstances } from '../api/calendar';
import { getHolidays } from '../api/holidays';
import type { TaskInstance, Holiday, MonthlyStatus } from '../types';
import {
    monthlyStatusMap as statusMap,
    SEASONALITY_LABELS as LABELS,
    SEASONALITY_MULTIPLIERS as MULTIPLIERS,
} from '../types';
import { format, addYears, subYears, startOfYear, eachMonthOfInterval, endOfYear } from 'date-fns';
import './YearView.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const seasonIcon: Record<string, React.ReactNode> = {
    P: <TrendingUp size={14} />, S: <TrendingDown size={14} />, N: <Minus size={14} />,
};

const categoryClass: Record<string, string> = {
    Health: 'cat-health', Bills: 'cat-bills', Taxes: 'cat-taxes',
    Work: 'cat-work', Personal: 'cat-personal',
};

export default function YearView() {
    const [currentYear, setCurrentYear] = useState(new Date());
    const [instances, setInstances] = useState<TaskInstance[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const months = eachMonthOfInterval({
            start: startOfYear(currentYear),
            end: endOfYear(currentYear),
        });

        // Fetch instances for each month in the year
        const instPromises = months.map((m) =>
            getMonthInstances(format(m, 'yyyy-MM-dd')).catch(() => [] as TaskInstance[])
        );

        Promise.all([...instPromises, getHolidays()])
            .then((results) => {
                const allHolidays = results.pop() as Holiday[];
                const allInstances = (results as TaskInstance[][]).flat();
                setInstances(allInstances);
                setHolidays(allHolidays);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [currentYear]);

    const months = eachMonthOfInterval({ start: startOfYear(currentYear), end: endOfYear(currentYear) });

    const instancesByMonth = useMemo(() => {
        const map: Record<number, TaskInstance[]> = {};
        for (const inst of instances) {
            const m = new Date(inst.occurrence_date).getMonth();
            if (!map[m]) map[m] = [];
            map[m].push(inst);
        }
        return map;
    }, [instances]);

    const holidaysByMonth = useMemo(() => {
        const map: Record<number, Holiday[]> = {};
        for (const h of holidays) {
            const m = new Date(h.holiday_date).getMonth();
            if (!map[m]) map[m] = [];
            map[m].push(h);
        }
        return map;
    }, [holidays]);

    const year = currentYear.getFullYear();

    return (
        <div className="yearview-page">
            <div className="page-header"><h1>Year View</h1><p>Monthly seasonality overview for {year}</p></div>

            <div className="yearview-controls">
                <div className="calendar-nav">
                    <button className="btn btn-ghost" onClick={() => setCurrentYear(subYears(currentYear, 1))}><ChevronLeft size={18} /></button>
                    <h2 className="yearview-label">{year}</h2>
                    <button className="btn btn-ghost" onClick={() => setCurrentYear(addYears(currentYear, 1))}><ChevronRight size={18} /></button>
                </div>
            </div>

            <div className="yearview-legend">
                {Object.entries(LABELS).map(([key, label]) => (
                    <div key={key} className={`legend-chip season-${key.toLowerCase()}`}>
                        {seasonIcon[key]} {label} (×{MULTIPLIERS[key as MonthlyStatus]})
                    </div>
                ))}
            </div>

            {loading && <div className="yearview-loading">Loading year data…</div>}

            <div className="yearview-grid stagger">
                {months.map((_month, i) => {
                    const season = statusMap[i] || 'N';
                    const monthInstances = instancesByMonth[i] || [];
                    const monthHolidays = holidaysByMonth[i] || [];
                    const completed = monthInstances.filter((inst) => inst.status === 'Completed').length;
                    const categories = [...new Set(monthInstances.map((inst) => inst.task?.category).filter(Boolean))];

                    return (
                        <div key={i} className={`yearview-month-card card season-${season.toLowerCase()}`}>
                            <div className="month-card-header">
                                <h3>{MONTH_NAMES[i]}</h3>
                                <span className={`season-pill season-${season.toLowerCase()}`}>
                                    {seasonIcon[season]} {LABELS[season]}
                                </span>
                            </div>
                            <div className="month-card-stats">
                                <span>{monthInstances.length} tasks</span>
                                <span>{completed} done</span>
                                <span>{monthHolidays.length} holidays</span>
                            </div>
                            <div className="month-card-cats">
                                {categories.map((cat) => (
                                    <span key={cat} className={`cat-dot ${categoryClass[cat!]}`} title={cat!} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
