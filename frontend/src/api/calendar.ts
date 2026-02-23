import { apiGet } from './client';
import type { TaskInstance } from '../types';

export function getMonthInstances(date: string): Promise<TaskInstance[]> {
    return apiGet<TaskInstance[]>(`/calendar/month/${date}`);
}

export function getWeekInstances(date: string): Promise<TaskInstance[]> {
    return apiGet<TaskInstance[]>(`/calendar/week/${date}`);
}
