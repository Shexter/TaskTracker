import './FilterBar.css';

const CATEGORIES = ['Health', 'Bills', 'Taxes', 'Work', 'Personal'] as const;

interface FilterBarProps {
    activeCategories: Set<string>;
    onToggle: (category: string) => void;
    onToggleAll: () => void;
    showHideRoutines?: boolean;
    hideRoutines?: boolean;
    onToggleHideRoutines?: () => void;
}

const categoryClass: Record<string, string> = {
    Health: 'filter-health',
    Bills: 'filter-bills',
    Taxes: 'filter-taxes',
    Work: 'filter-work',
    Personal: 'filter-personal',
};

export default function FilterBar({
    activeCategories,
    onToggle,
    onToggleAll,
    showHideRoutines,
    hideRoutines,
    onToggleHideRoutines,
}: FilterBarProps) {
    const allActive = activeCategories.size === CATEGORIES.length;

    return (
        <div className="filter-bar">
            <span className="filter-label">Filter</span>
            <button
                className={`filter-chip ${allActive ? 'active all' : ''}`}
                onClick={onToggleAll}
            >
                All
            </button>
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    className={`filter-chip ${categoryClass[cat]} ${activeCategories.has(cat) ? 'active' : ''}`}
                    onClick={() => onToggle(cat)}
                >
                    <span className="filter-dot" />
                    {cat}
                </button>
            ))}
            {showHideRoutines && (
                <>
                    <span className="filter-divider" />
                    <button
                        className={`filter-chip routine-toggle ${hideRoutines ? 'active' : ''}`}
                        onClick={onToggleHideRoutines}
                    >
                        {hideRoutines ? '🫣 Routines hidden' : '👁️ Show all'}
                    </button>
                </>
            )}
        </div>
    );
}
