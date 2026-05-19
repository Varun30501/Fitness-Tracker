import React from 'react';

interface InputProps {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    min?: string | number;
    max?: string | number;
}

export default function Input({ label, type = 'text', value, onChange, placeholder = '', className = '', required = false, min, max }: InputProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className='w-full rounded-lg border border-slate-200/80 bg-white/75 px-4 py-3 text-slate-800 shadow-sm shadow-slate-950/5 outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500'
            />
        </div>
    );
}
