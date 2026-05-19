import { type ReactNode } from "react";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className="relative group flex items-center">
            {children}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-900/95 p-2 text-center text-xs text-white shadow-xl shadow-slate-950/20 backdrop-blur-xl group-hover:block">
                {content}
            </div>
        </div>
    );
}
