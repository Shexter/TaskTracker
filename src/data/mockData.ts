import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  addMonths,
  subMonths,
} from 'date-fns';

// ============================================
// Types matching backend Pydantic schemas
// ============================================

export interface User {
  id: string;
  email: string;
  timezone: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  task_id: string;
  name: string;
  category: 'Health' | 'Bills' | 'Taxes' | 'Work' | 'Personal';
  period: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'OneTime';
  occurrence: string;
  base_time_minutes: number;
  status: 'Active' | 'Inactive' | 'Archived';
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
  category: 'Personal' | 'Business';
  created_at: string;
}

// ============================================
// Mock User
// ============================================

export const mockUser: User = {
  id: 'u-001',
  email: 'user@tasktracker.dev',
  timezone: 'America/Vancouver',
  created_at: '2026-01-01T00:00:00Z',
};

// ============================================
// Mock Tasks (from PRD)
// ============================================

export const mockTasks: Task[] = [
  {
    id: 't-001',
    user_id: 'u-001',
    task_id: 'T001',
    name: 'Brush Teeth',
    category: 'Health',
    period: 'Weekly',
    occurrence: 'Mon,Wed,Fri',
    base_time_minutes: 5,
    status: 'Active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 't-002',
    user_id: 'u-001',
    task_id: 'T002',
    name: 'Pay Rent',
    category: 'Bills',
    period: 'Monthly',
    occurrence: '1',
    base_time_minutes: 15,
    status: 'Active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 't-003',
    user_id: 'u-001',
    task_id: 'T003',
    name: 'Pay Tax Installment',
    category: 'Taxes',
    period: 'Quarterly',
    occurrence: 'Mar 1',
    base_time_minutes: 30,
    status: 'Active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 't-004',
    user_id: 'u-001',
    task_id: 'T004',
    name: 'Complete Taxes',
    category: 'Taxes',
    period: 'Yearly',
    occurrence: 'Apr 30',
    base_time_minutes: 120,
    status: 'Active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 't-005',
    user_id: 'u-001',
    task_id: 'T005',
    name: 'Weekly Team Standup',
    category: 'Work',
    period: 'Weekly',
    occurrence: 'Mon,Tue,Wed,Thu,Fri',
    base_time_minutes: 15,
    status: 'Active',
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 't-006',
    user_id: 'u-001',
    task_id: 'T006',
    name: 'Grocery Shopping',
    category: 'Personal',
    period: 'Weekly',
    occurrence: 'Sat',
    base_time_minutes: 60,
    status: 'Active',
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 't-007',
    user_id: 'u-001',
    task_id: 'T007',
    name: 'Gym Workout',
    category: 'Health',
    period: 'Weekly',
    occurrence: 'Tue,Thu,Sat',
    base_time_minutes: 60,
    status: 'Active',
    created_at: '2026-02-01T00:00:00Z',
  },
];

// ============================================
// Mock Holidays (Canadian, from PRD)
// ============================================

export const mockHolidays: Holiday[] = [
  { id: 'h-001', user_id: 'u-001', name: "New Year's Day", holiday_date: '2026-01-01', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-002', user_id: 'u-001', name: 'Family Day', holiday_date: '2026-02-16', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-003', user_id: 'u-001', name: 'Good Friday', holiday_date: '2026-04-03', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-004', user_id: 'u-001', name: 'Victoria Day', holiday_date: '2026-05-18', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-005', user_id: 'u-001', name: 'Canada Day', holiday_date: '2026-07-01', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-006', user_id: 'u-001', name: 'B.C. Day', holiday_date: '2026-08-03', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-007', user_id: 'u-001', name: 'Labour Day', holiday_date: '2026-09-07', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-008', user_id: 'u-001', name: 'Thanksgiving', holiday_date: '2026-10-12', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-009', user_id: 'u-001', name: 'Remembrance Day', holiday_date: '2026-11-11', category: 'Business', created_at: '2026-01-01T00:00:00Z' },
  { id: 'h-010', user_id: 'u-001', name: 'Christmas Day', holiday_date: '2026-12-25', category: 'Personal', created_at: '2026-01-01T00:00:00Z' },
];

// ============================================
// Recurrence Expansion (client-side mock)
// ============================================

const DAY_MAP: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

let instanceCounter = 1;

function generateId(): string {
  return `i-${String(instanceCounter++).padStart(4, '0')}`;
}

export function expandTaskInstances(
  tasks: Task[],
  monthDate: Date
): TaskInstance[] {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const allDays = eachDayOfInterval({ start, end });
  const instances: TaskInstance[] = [];

  for (const task of tasks) {
    if (task.status !== 'Active') continue;

    if (task.period === 'Weekly') {
      const targetDays = task.occurrence.split(',').map((d) => DAY_MAP[d.trim()]);
      for (const day of allDays) {
        if (targetDays.includes(getDay(day))) {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isPast = day < new Date();
          instances.push({
            id: generateId(),
            task_id: task.id,
            user_id: task.user_id,
            occurrence_date: dateStr,
            status: isPast ? (Math.random() > 0.2 ? 'Completed' : 'Pending') : 'Pending',
            completed_at: isPast && Math.random() > 0.2 ? dateStr + 'T09:00:00Z' : null,
            created_at: task.created_at,
            task,
          });
        }
      }
    } else if (task.period === 'Monthly') {
      const dayNum = parseInt(task.occurrence, 10);
      if (!isNaN(dayNum)) {
        for (const day of allDays) {
          if (day.getDate() === dayNum) {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isPast = day < new Date();
            instances.push({
              id: generateId(),
              task_id: task.id,
              user_id: task.user_id,
              occurrence_date: dateStr,
              status: isPast ? 'Completed' : 'Pending',
              completed_at: isPast ? dateStr + 'T10:00:00Z' : null,
              created_at: task.created_at,
              task,
            });
          }
        }
      }
    } else if (task.period === 'Quarterly') {
      const parts = task.occurrence.split(' ');
      if (parts.length === 2) {
        const monthNames: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const targetMonth = monthNames[parts[0]];
        const targetDay = parseInt(parts[1], 10);
        const quarterMonths = [targetMonth, targetMonth + 3, targetMonth + 6, targetMonth + 9].map(m => m % 12);

        if (quarterMonths.includes(monthDate.getMonth())) {
          const dateStr = format(new Date(monthDate.getFullYear(), monthDate.getMonth(), targetDay), 'yyyy-MM-dd');
          instances.push({
            id: generateId(),
            task_id: task.id,
            user_id: task.user_id,
            occurrence_date: dateStr,
            status: 'Pending',
            completed_at: null,
            created_at: task.created_at,
            task,
          });
        }
      }
    } else if (task.period === 'Yearly') {
      const parts = task.occurrence.split(' ');
      if (parts.length === 2) {
        const monthNames: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const targetMonth = monthNames[parts[0]];
        if (monthDate.getMonth() === targetMonth) {
          const targetDay = parseInt(parts[1], 10);
          const dateStr = format(new Date(monthDate.getFullYear(), targetMonth, targetDay), 'yyyy-MM-dd');
          instances.push({
            id: generateId(),
            task_id: task.id,
            user_id: task.user_id,
            occurrence_date: dateStr,
            status: 'Pending',
            completed_at: null,
            created_at: task.created_at,
            task,
          });
        }
      }
    }
  }

  return instances;
}

// ============================================
// Dashboard Metrics
// ============================================

export interface DashboardMetrics {
  totalTasks: number;
  completionRate: number;
  hoursScheduled: number;
  busiestDay: string;
  tasksByCategory: { name: string; count: number; color: string }[];
  weeklyData: { day: string; completed: number; pending: number }[];
  upcomingTasks: TaskInstance[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Health: 'hsl(160, 84%, 39%)',
  Bills: 'hsl(217, 91%, 60%)',
  Taxes: 'hsl(38, 92%, 50%)',
  Work: 'hsl(263, 70%, 58%)',
  Personal: 'hsl(350, 89%, 60%)',
};

export function computeMetrics(
  tasks: Task[],
  instances: TaskInstance[]
): DashboardMetrics {
  const completed = instances.filter((i) => i.status === 'Completed').length;
  const total = instances.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const hoursScheduled = tasks.reduce((sum, t) => {
    const taskInstances = instances.filter((i) => i.task_id === t.id);
    return sum + (taskInstances.length * t.base_time_minutes) / 60;
  }, 0);

  // Count by day to find busiest
  const dayCounts: Record<string, number> = {};
  for (const inst of instances) {
    const dayName = format(new Date(inst.occurrence_date), 'EEEE');
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  }
  const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Category breakdown
  const catCounts: Record<string, number> = {};
  for (const task of tasks) {
    const count = instances.filter((i) => i.task_id === task.id).length;
    catCounts[task.category] = (catCounts[task.category] || 0) + count;
  }
  const tasksByCategory = Object.entries(catCounts).map(([name, count]) => ({
    name,
    count,
    color: CATEGORY_COLORS[name] || '#888',
  }));

  // Weekly distribution (last 7 days)
  const today = new Date();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = weekDays.map((day) => {
    const dayInstances = instances.filter((i) => {
      const d = new Date(i.occurrence_date);
      const dayName = format(d, 'EEE');
      return dayName === day;
    });
    return {
      day,
      completed: dayInstances.filter((i) => i.status === 'Completed').length,
      pending: dayInstances.filter((i) => i.status === 'Pending').length,
    };
  });

  // Upcoming tasks
  const todayStr = format(today, 'yyyy-MM-dd');
  const upcomingTasks = instances
    .filter((i) => i.occurrence_date >= todayStr && i.status === 'Pending')
    .sort((a, b) => a.occurrence_date.localeCompare(b.occurrence_date))
    .slice(0, 5);

  return {
    totalTasks: total,
    completionRate,
    hoursScheduled: Math.round(hoursScheduled * 10) / 10,
    busiestDay,
    tasksByCategory,
    weeklyData,
    upcomingTasks,
  };
}

// ============================================
// Chat mock responses
// ============================================

export const chatSuggestions = [
  'How busy am I this week?',
  'Show my overdue tasks',
  'What should I prioritize today?',
  'Summarize my February schedule',
];

export function getMockChatResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('busy') || lower.includes('week')) {
    return "Based on your schedule, you have **12 tasks** this week. Monday, Wednesday, and Friday are your busiest days with Brush Teeth and Team Standup meetings. I'd recommend tackling your workout sessions on Tue/Thu/Sat to maintain balance. 💪";
  }
  if (lower.includes('overdue')) {
    return "You currently have **2 overdue tasks**: *Pay Rent* (due Feb 1) — marked as Completed ✅, and *Brush Teeth* on Monday — still Pending ⚠️. Would you like me to help you reschedule?";
  }
  if (lower.includes('prioritize') || lower.includes('today')) {
    return "For today, I'd prioritize:\n1. **Weekly Team Standup** (15 min) — required for work\n2. **Brush Teeth** (5 min) — quick win ✅\n3. **Gym Workout** (60 min) — if it's a Tue/Thu/Sat\n\nYou have about **1.3 hours** of scheduled tasks. Looks like a manageable day!";
  }
  if (lower.includes('february') || lower.includes('month')) {
    return "📅 **February 2026 Summary:**\n- Total scheduled instances: **48 tasks**\n- Completion rate: **78%**\n- Most active category: **Work** (22 instances)\n- Key date: **Feb 16** — Family Day holiday 🎉\n- Hours scheduled: **18.5 hours**";
  }
  return "I can help you analyze your schedule, find overdue tasks, or suggest priorities. Try asking me something like \"How busy am I this week?\" or \"What should I prioritize today?\" 🤖";
}

// ============================================
// Seasonality & Monthly Status (from PRD SET UP)
// ============================================

export type MonthlyStatus = 'N' | 'P' | 'S'; // Normal, Peak, Slow

export const monthlyStatusMap: Record<number, MonthlyStatus> = {
  0: 'N',  // Jan
  1: 'N',  // Feb
  2: 'P',  // Mar — tax season ramp
  3: 'P',  // Apr — tax deadline
  4: 'N',  // May
  5: 'S',  // Jun — summer slow
  6: 'S',  // Jul — summer slow
  7: 'S',  // Aug — summer slow
  8: 'N',  // Sep
  9: 'N',  // Oct
  10: 'N', // Nov
  11: 'P', // Dec — year-end
};

export const SEASONALITY_MULTIPLIERS: Record<MonthlyStatus, number> = {
  N: 1.0,
  P: 1.5,
  S: 0.7,
};

export const SEASONALITY_LABELS: Record<MonthlyStatus, string> = {
  N: 'Normal',
  P: 'Peak',
  S: 'Slow',
};

// ============================================
// Week-range task expansion
// ============================================

import { startOfWeek, endOfWeek } from 'date-fns';
export { startOfWeek, endOfWeek };

export function expandTaskInstancesForWeek(
  tasks: Task[],
  weekStart: Date
): TaskInstance[] {
  const start = startOfWeek(weekStart, { weekStartsOn: 0 });
  const end = endOfWeek(weekStart, { weekStartsOn: 0 });
  const allDays = eachDayOfInterval({ start, end });
  const instances: TaskInstance[] = [];

  for (const task of tasks) {
    if (task.status !== 'Active') continue;

    if (task.period === 'Weekly') {
      const targetDays = task.occurrence.split(',').map((d) => DAY_MAP[d.trim()]);
      for (const day of allDays) {
        if (targetDays.includes(getDay(day))) {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isPast = day < new Date();
          instances.push({
            id: generateId(),
            task_id: task.id,
            user_id: task.user_id,
            occurrence_date: dateStr,
            status: isPast ? (Math.random() > 0.2 ? 'Completed' : 'Pending') : 'Pending',
            completed_at: isPast && Math.random() > 0.2 ? dateStr + 'T09:00:00Z' : null,
            created_at: task.created_at,
            task,
          });
        }
      }
    } else if (task.period === 'Monthly') {
      const dayNum = parseInt(task.occurrence, 10);
      if (!isNaN(dayNum)) {
        for (const day of allDays) {
          if (day.getDate() === dayNum) {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isPast = day < new Date();
            instances.push({
              id: generateId(),
              task_id: task.id,
              user_id: task.user_id,
              occurrence_date: dateStr,
              status: isPast ? 'Completed' : 'Pending',
              completed_at: isPast ? dateStr + 'T10:00:00Z' : null,
              created_at: task.created_at,
              task,
            });
          }
        }
      }
    }
  }

  return instances;
}

// ============================================
// Gamification — XP & Levels
// ============================================

export interface GamificationData {
  xp: number;
  level: number;
  levelName: string;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  streak: number;
}

const LEVELS = [
  { name: 'Beginner', xp: 0 },
  { name: 'Productive', xp: 100 },
  { name: 'Achiever', xp: 300 },
  { name: 'Master', xp: 600 },
  { name: 'Legend', xp: 1000 },
];

export function computeXP(instances: TaskInstance[]): GamificationData {
  const completed = instances.filter((i) => i.status === 'Completed').length;
  const xp = completed * 5; // 5 XP per completion

  // Find level
  let level = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      level = i;
      break;
    }
  }

  const currentLevelXp = LEVELS[level].xp;
  const nextLevelXp = level < LEVELS.length - 1 ? LEVELS[level + 1].xp : LEVELS[level].xp + 500;
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpForNextLevel = nextLevelXp - currentLevelXp;

  // Mock streak (consecutive days with completions)
  const streak = Math.min(Math.floor(completed / 3), 14);

  return {
    xp,
    level,
    levelName: LEVELS[level].name,
    xpForNextLevel,
    xpInCurrentLevel,
    streak,
  };
}

// Re-export date-fns utilities for convenience
export { format, startOfMonth, endOfMonth, addMonths, subMonths };

