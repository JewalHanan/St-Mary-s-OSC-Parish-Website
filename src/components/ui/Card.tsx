import { ReactNode, CSSProperties } from 'react';
import styles from '@/styles/Card.module.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    withGlow?: boolean;
    style?: CSSProperties;
}

export function Card({ children, className = '', withGlow = false, style }: CardProps) {
    return (
        <div className={`${styles.card} ${withGlow ? styles.glow : ''} ${className}`} style={style}>
            {children}
        </div>
    );
}
