import React from 'react'

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`glass-panel interactive-lift reveal-up rounded-lg p-5 ${className}`}>
            {children}
        </div>
    );
}

export default Card
