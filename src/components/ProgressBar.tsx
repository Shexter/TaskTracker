import { useMemo } from 'react';
import { Flame, Zap, Trophy, Star, Target } from 'lucide-react';
import {
    mockTasks,
    expandTaskInstances,
    computeXP,
} from '../data/mockData';
import './ProgressBar.css';

const LEVEL_ICONS = [
    <Target size={14} />,
    <Zap size={14} />,
    <Star size={14} />,
    <Trophy size={14} />,
    <Flame size={14} />,
];

export default function ProgressBar() {
    const gamification = useMemo(() => {
        const instances = expandTaskInstances(mockTasks, new Date());
        return computeXP(instances);
    }, []);

    const progressPercent = gamification.xpForNextLevel > 0
        ? Math.min((gamification.xpInCurrentLevel / gamification.xpForNextLevel) * 100, 100)
        : 100;

    return (
        <div className="progress-bar-container">
            <div className="progress-left">
                <div className="progress-level-badge">
                    {LEVEL_ICONS[gamification.level]}
                    <span className="level-name">{gamification.levelName}</span>
                </div>
                <div className="progress-xp-text">
                    <span className="xp-current">{gamification.xp} XP</span>
                    <span className="xp-separator">·</span>
                    <span className="xp-next">
                        {gamification.xpInCurrentLevel}/{gamification.xpForNextLevel} to next level
                    </span>
                </div>
            </div>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
                <div className="progress-shimmer" />
            </div>

            <div className="progress-right">
                <div className="streak-badge">
                    <Flame size={14} />
                    <span className="streak-count">{gamification.streak}</span>
                    <span className="streak-label">day streak</span>
                </div>
            </div>
        </div>
    );
}
