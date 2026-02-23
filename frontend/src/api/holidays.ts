import { apiGet } from './client';
import type { Holiday } from '../types';

export function getHolidays(): Promise<Holiday[]> {
    return apiGet<Holiday[]>('/holidays');
}
