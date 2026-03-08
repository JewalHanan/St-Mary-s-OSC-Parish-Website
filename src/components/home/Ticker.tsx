'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/Ticker.module.css';

export default function Ticker() {
    const text = "Holy Qurbono every Sunday at 8:30 AM — St. Mary's Malankara Orthodox Church, Muthupilakkadu";

    return (
        <div className={styles.tickerContainer}>
            <motion.div
                className={styles.tickerTrack}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
            >
                <span className={styles.tickerItem}>
                    Let us stand well, let us stand in awe <span className={styles.separator}>✝️</span> {text}
                </span>
                <span className={styles.tickerItem}>
                    <span className={styles.separator}>✝️</span> {text}
                </span>
                <span className={styles.tickerItem}>
                    <span className={styles.separator}>✝️</span> {text}
                </span>
                <span className={styles.tickerItem}>
                    <span className={styles.separator}>✝️</span> {text}
                </span>
            </motion.div>
        </div>
    );
}
