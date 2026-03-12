'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSiteSettings, type SiteSettings } from '@/lib/store';
import styles from '@/styles/Contact.module.css';

export default function ContactPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        getSiteSettings().then(setSettings);
    }, []);

    if (!settings) return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />;

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
                    <p>{settings.contact.addressLine1}</p>
                    <p>{settings.contact.addressLine2}</p>
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
                    <p>{settings.contact.phone}</p>

                    <h2>📧 Email</h2>
                    <p>{settings.contact.email}</p>

                    <h2>⏰ Service Timings</h2>
                    {settings.contact.serviceTimings.map((timing, i) => (
                        <p key={i}><strong>{timing.label}:</strong> {timing.time}</p>
                    ))}
                </motion.div>

                <motion.div
                    className={styles.mapContainer}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <iframe
                        title="Church Location — St. Mary's Malankara Orthodox Syrian Church, Muthupilakkadu"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6974288594246!2d76.657074474932!3d9.00000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b060f0f0f0f0f0f%3A0x0!2sSt.%20Mary&#39;s%20Malankara%20Orthodox%20Church%2C%20Muthupilakkadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '16px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <a href="https://maps.app.goo.gl/qi8XaMVmmYGMwbtG7" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-accent)' }}>
                            View exact location on Google Maps ↗
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
