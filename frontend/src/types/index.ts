// ============================================
// Shared TypeScript types for the TaskTracker app
// These mirror the backend Pydantic schemas
// ============================================

export interface RecurrenceRule {
    period: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'OneTime';
    occurrence: string;
}

export interface Task {
    id: string;
    user_id: string;
    task_code: string;
    name: string;
    category: 'Health' | 'Bills' | 'Taxes' | 'Work' | 'Personal';
    recurrence_rule: RecurrenceRule;
    base_time_minutes: number | null;
    priority: number;
    status: 'Active' | 'Inactive' | 'Archived';
    notes: string | null;
    created_at: string;
}

export interface TaskInstance {
    id: string;
    task_id: string;
    user_id: string;
    occurrence_date: string; // YYYY-MM-DD
    status: 'Pending' | 'Completed' | 'Skipped' | 'Cancelled';
    completed_at: string | null;
    created_at: string;
    task?: Task;
}

export interface Holiday {
    id: string;
    user_id: string;
    name: string;
    holiday_date: string; // YYYY-MM-DD
    category: string;
    created_at: string;
}

export interface CategoryCount {
    name: string;
    count: number;
    color: string;
}

export interface WeekDayData {
    day: string;
    completed: number;
    pending: number;
}

export interface DashboardMetrics {
    totalTasks: number;
    completionRate: number;
    hoursScheduled: number;
    busiestDay: string;
    tasksByCategory: CategoryCount[];
    weeklyData: WeekDayData[];
    upcomingTasks: TaskInstance[];
}

export interface GamificationData {
    xp: number;
    level: number;
    levelName: string;
    xpForNextLevel: number;
    xpInCurrentLevel: number;
    streak: number;
}

// Seasonality types (client-side for now)
export type MonthlyStatus = 'N' | 'P' | 'S';

export const monthlyStatusMap: Record<number, MonthlyStatus> = {
    0: 'N', 1: 'N', 2: 'P', 3: 'P', 4: 'N',
    5: 'S', 6: 'S', 7: 'S', 8: 'N', 9: 'N', 10: 'N', 11: 'P',
};

export const SEASONALITY_MULTIPLIERS: Record<MonthlyStatus, number> = {
    N: 1.0, P: 1.5, S: 0.7,
};

export const SEASONALITY_LABELS: Record<MonthlyStatus, string> = {
    N: 'Normal', P: 'Peak', S: 'Slow',
};
