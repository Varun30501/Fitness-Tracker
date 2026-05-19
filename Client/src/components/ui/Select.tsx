import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options?: SelectOption[];
    className?: string;
    required?: boolean;
    placeholder?: string;
}

export default function Select({ label, value, onChange, options = [], className = '', required = false, placeholder = 'Select an option' }: SelectProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}
            <div className='relative'>
                <select
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
                    className='w-full cursor-pointer appearance-none rounded-lg border border-slate-200/80 bg-white/75 px-4 py-3 text-slate-800 shadow-sm shadow-slate-950/5 outline-none backdrop-blur-xl transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-slate-900/70 dark:text-white'
                >
                    <option value='' disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none' />
            </div>
        </div>
    );
}
