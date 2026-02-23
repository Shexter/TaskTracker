import { apiGet, apiPost, apiDelete } from './client';
import type { Task, RecurrenceRule } from '../types';

export function getTasks(): Promise<Task[]> {
    return apiGet<Task[]>('/tasks');
}

export interface CreateTaskPayload {
    name: string;
    category: string;
    recurrence_rule: RecurrenceRule;
    base_time_minutes?: number;
    priority?: number;
    notes?: string;
}

export function createTask(data: CreateTaskPayload): Promise<Task> {
    return apiPost<Task>('/tasks', data);
}

export function deleteTask(id: string): Promise<void> {
    return apiDelete(`/tasks/${id}`);
}
