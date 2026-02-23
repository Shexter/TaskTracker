import { useState, useEffect } from 'react';
import { Zap, Flame, Trophy } from 'lucide-react';
import { getGamification } from '../api/gamification';
import type { GamificationData } from '../types';
import './ProgressBar.css';

export default function ProgressBar() {
    const [data, setData] = useState<GamificationData | null>(null);

    useEffect(() => {
        getGamification().then(setData).catch(console.error);
    }, []);

    if (!data) {
        return (
            <div className="progress-bar-widget">
                <div className="progress-loading">Loading...</div>
            </div>
        );
    }

    const progressPercent = data.xpForNextLevel > 0
        ? Math.round((data.xpInCurrentLevel / data.xpForNextLevel) * 100)
        : 100;

    return (
        <div className="progress-bar-widget">
            <div className="xp-header">
                <div className="level-badge">
                    <Trophy size={14} />
                    <span>Lv.{data.level}</span>
                </div>
                <span className="level-name">{data.levelName}</span>
            </div>

            <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }}>
                    <Zap size={12} />
                </div>
            </div>

            <div className="xp-stats">
                <span className="xp-amount">{data.xpInCurrentLevel}/{data.xpForNextLevel} XP</span>
                <div className="streak-badge">
                    <Flame size={14} />
                    <span>{data.streak} day{data.streak !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
}
