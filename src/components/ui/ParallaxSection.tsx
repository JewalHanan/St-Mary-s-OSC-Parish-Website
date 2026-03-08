'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from '@/styles/ParallaxSection.module.css';

interface ParallaxSectionProps {
    children: ReactNode;
    backgroundImage?: string;
    speed?: number; // Parallax speed multiplier, e.g. 0.5 for moderate
    overlayOpacity?: number;
}

export function ParallaxSection({
    children,
    backgroundImage,
    speed = 0.5,
    overlayOpacity = 0.6
}: ParallaxSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Background moves opposite to scroll direction at a specific speed
    const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    // Content enters with a slight depth fade
    const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={ref} className={styles.parallaxContainer}>
            {backgroundImage && (
                <motion.div
                    className={styles.parallaxBackground}
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        y: yBg
                    }}
                >
                    <div className={styles.overlay} style={{ backgroundColor: `rgba(10, 15, 44, ${overlayOpacity})` }} />
                </motion.div>
            )}

            <motion.div
                className={styles.parallaxContent}
                style={{ y: contentY, opacity: contentOpacity }}
            >
                {children}
            </motion.div>
        </section>
    );
}
