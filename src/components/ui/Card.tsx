import { ReactNode, CSSProperties } from 'react';
import styles from '@/styles/Card.module.css';
import { GlowingEffect } from '@/components/ui/GlowingEffect';

interface CardProps {
    children: ReactNode;
    className?: string;
    withGlow?: boolean;
    style?: CSSProperties;
    glowVariant?: "gold" | "maroon" | "white";
    glowSpread?: number;
    glowBorderWidth?: number;
    disableGlowEffect?: boolean;
}

export function Card({
    children,
    className = '',
    withGlow = false,
    style,
    glowVariant = "gold",
    glowSpread = 30,
    glowBorderWidth = 2,
    disableGlowEffect = false,
}: CardProps) {
    return (
        <div
            className={`${styles.card} ${withGlow ? styles.glow : ''} ${className}`}
            style={{ ...style, position: 'relative' }}
        >
            {withGlow && !disableGlowEffect && (
                <GlowingEffect
                    spread={glowSpread}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={glowBorderWidth}
                    variant={glowVariant}
                />
            )}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
                {children}
            </div>
        </div>
    );
}
