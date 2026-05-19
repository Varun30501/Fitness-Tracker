import React from "react";

interface SliderProps {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    className?: string;
    unit?: string;
    infoText?: string;
}

import { Info } from "lucide-react";
import Tooltip from "./Tooltip";

const Slider: React.FC<SliderProps> = ({ label, min = 0, max = 100, step = 1, value, onChange, className = "", unit = "", infoText }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
                        {infoText && (
                            <Tooltip content={infoText}>
                                <Info className="size-4 text-slate-400 hover:text-emerald-500 cursor-help transition-colors" />
                            </Tooltip>
                        )}
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {value} {unit}
                    </span>
                </div>
            )}
            <div className="relative h-2 w-full cursor-pointer rounded-full bg-slate-200/80 shadow-inner shadow-slate-950/5 dark:bg-slate-700/80">
                {/* Track fill */}
                <div className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/20" style={{ width: `${percentage}%` }} />

                {/* Thumb input */}
                <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer z-10" />

                <div className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white shadow-lg shadow-emerald-900/20 transition-transform duration-75 ease-out dark:bg-slate-950" style={{ left: `calc(${percentage}% - 10px)` }} />
            </div>
        </div>
    );
};

export default Slider;
