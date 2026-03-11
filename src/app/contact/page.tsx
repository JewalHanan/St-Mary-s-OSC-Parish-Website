'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/Contact.module.css';

export default function ContactPage() {
    return (
        <div className={styles.pageContainer}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Contact Us</h1>
                <p>We&apos;d love to hear from you. Reach out to St. Mary&apos;s Church.</p>
            </motion.div>

            <div className={styles.contentGrid}>
                <motion.div
                    className={styles.infoCard}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2>📍 Address</h2>
                    <p>St. Mary&apos;s Malankara Orthodox Syrian Church</p>
                    <p>Muthupilakkadu, Kollam</p>
                    <p>Kerala — 691 578, India</p>
                    <a
                        href="https://maps.app.goo.gl/qi8XaMVmmYGMwbtG7"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block', marginTop: '0.75rem',
                            padding: '8px 18px', borderRadius: '8px',
                            background: 'var(--accent-primary)', color: 'var(--color-navy)',
                            fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none',
                        }}
                    >
                        🗺️ Open in Google Maps
                    </a>

                    <h2>📞 Phone</h2>
                    <p>+91 7034756977</p>

                    <h2>📧 Email</h2>
                    <p>info@stmosc.org</p>

                    <h2>⏰ Service Timings</h2>
                    <p><strong>Sunday Holy Qurbono:</strong> 8:30 AM</p>
                    <p><strong>Wednesday Evening Prayer:</strong> 6:00 PM</p>
                    <p><strong>Saturday Vespers:</strong> 5:30 PM</p>
                </motion.div>

                <motion.div
                    className={styles.mapContainer}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <iframe
                        title="Church Location — St. Mary's Malankara Orthodox Church, Muthupilakkadu"
                        src="https://maps.google.com/maps?q=Muthupilakkadu+Malankara+Orthodox+Church+Kollam&output=embed&z=15"
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '16px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <a href="https://maps.app.goo.gl/qi8XaMVmmYGMwbtG7" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
                            View exact location on Google Maps ↗
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
