'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Ticker.module.css';

/** Compute the next Sunday from today (or today if it IS Sunday). */
function getNextSunday(): Date {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun
    const daysUntilSunday = day === 0 ? 0 : 7 - day;
    const next = new Date(now);
    next.setDate(now.getDate() + daysUntilSunday);
    return next;
}

function formatDate(d: Date): string {
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function Ticker() {
    const [tickerText, setTickerText] = useState('');

    useEffect(() => {
        // Build default text based on the next upcoming Sunday
        // Use setting if provided; else dynamic auto-generated string
        const nextSun = getNextSunday();
        const defaultText = `Next Holy Qurbono — Sunday ${formatDate(nextSun)} at 7:00 AM — St. Mary's Malankara Orthodox Syrian Church, Muthupilakkadu`;
        setTickerText(defaultText);

        // Try to fetch ticker override from site-settings
        fetch('/api/data/site-settings', { cache: 'no-store' })
            .then(r => r.ok ? r.json() : null)
            .then(settings => {
                if (settings?.tickerOverride) {
                    setTickerText(settings.tickerOverride);
                }
            })
            .catch(() => { /* use default */ });
    }, []);

    if (!tickerText) return null;

    return (
        <div className={styles.tickerContainer}>
            <motion.div
                className={styles.tickerTrack}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
            >
                <span className={styles.tickerItem}>
                    Let us stand well, let us stand in awe <span className={styles.separator}>✝️</span> {tickerText}
                </span>
                <span className={styles.tickerItem}>
                    <span className={styles.separator}>✝️</span> {tickerText}
                </span>
                <span className={styles.tickerItem}>
                    <span className={styles.separator}>✝️</span> {tickerText}
                </span>
                <span className={styles.tickerItem}>
                    <span className={styles.separator}>✝️</span> {tickerText}
                </span>
            </motion.div>
        </div>
    );
}
