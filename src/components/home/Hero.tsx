'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CenterStageSlider from '@/components/CenterStageSlider';
import styles from '@/styles/Hero.module.css';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const yHeader = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
    const opacityHeader = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

    return (
        <section ref={containerRef} className={styles.heroSection}>
            {/* Church name header — parallax fades on scroll */}
            <motion.div
                className={styles.heroHeader}
                style={{ y: yHeader, opacity: opacityHeader }}
            >
                <motion.div
                    className={styles.logoContainer}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <img src="/images/logo.png" alt="St. Mary's Logo" className={styles.logoGlow} />
                </motion.div>

                <motion.h1
                    className={styles.title}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                >
                    St. Mary&apos;s <br /> Malankara Orthodox Syrian Church
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                >
                    Muthupilakkadu, Kollam
                </motion.p>
            </motion.div>

            {/* Center-Stage Slider — right below the church name */}
            <motion.div
                className={styles.sliderArea}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                <CenterStageSlider autoPlayMs={5000} logoSrc="/images/logo.png" />
            </motion.div>

            {/* Scroll indicator */}
            <div className={styles.scrollIndicator}>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                    <span>↓</span>
                </motion.div>
            </div>
        </section>
    );
}
