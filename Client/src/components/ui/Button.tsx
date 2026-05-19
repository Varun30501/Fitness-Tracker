import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: ButtonProps) {
    const baseStyles = 'px-5 py-3 flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

    const variants = {
        primary: 'bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/30 focus:ring-emerald-500/20',
        secondary: 'border border-white/70 bg-white/70 text-slate-700 shadow-sm shadow-slate-950/5 backdrop-blur-xl hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-emerald-500/30 dark:hover:bg-slate-800 focus:ring-slate-400/20',
        danger: 'border border-red-200/80 bg-red-50/80 text-red-600 shadow-sm shadow-red-950/5 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/40 focus:ring-red-400/20',
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
}
