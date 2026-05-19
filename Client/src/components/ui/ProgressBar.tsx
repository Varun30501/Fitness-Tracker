export default function ProgressBar({ value, max = 100, className = '' }: { value: number; max?: number; className?: string; }) {

    const percentage = Math.min(Math.round((value / max) * 100), 100);
    const isOverLimit = value > max;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100/90 shadow-inner shadow-slate-950/5 dark:bg-slate-800/80">
                <div
                    className={`h-full rounded-full shadow-lg transition-all duration-700 ease-out ${isOverLimit ? 'bg-linear-to-r from-red-500 to-orange-500 shadow-red-500/25' : 'bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/25'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
