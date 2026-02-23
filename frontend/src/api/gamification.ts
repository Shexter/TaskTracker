import { apiGet } from './client';
import type { GamificationData } from '../types';

export function getGamification(): Promise<GamificationData> {
    return apiGet<GamificationData>('/gamification');
}
