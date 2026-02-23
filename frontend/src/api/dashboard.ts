import { apiGet } from './client';
import type { DashboardMetrics } from '../types';

export function getDashboardMetrics(): Promise<DashboardMetrics> {
    return apiGet<DashboardMetrics>('/dashboard/metrics');
}
