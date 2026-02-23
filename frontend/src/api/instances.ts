import { apiPatch } from './client';
import type { TaskInstance } from '../types';

export function updateInstanceStatus(
    id: string,
    status: 'Pending' | 'Completed' | 'Skipped' | 'Cancelled'
): Promise<TaskInstance> {
    return apiPatch<TaskInstance>(`/task-instances/${id}`, { status });
}
