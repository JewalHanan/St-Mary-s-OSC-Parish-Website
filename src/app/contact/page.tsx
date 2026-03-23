'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getSiteSettings, type SiteSettings } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';
import styles from '@/styles/Contact.module.css';

export default function ContactPage() {
    const { data: settings } = useStoreData(getSiteSettings, null as SiteSettings | null);

    if (!settings) return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />;

    return (
        <div className={styles.pageContainer}>
            <ScrollReveal>
                <div className={styles.header}>
                    <h1>Contact Us</h1>
                    <p>We&apos;d love to hear from you. Reach out to St. Mary&apos;s Church.</p>
                </div>
            </ScrollReveal>

            <div className={styles.contentGrid}>
                <ScrollReveal delay={0.1} direction="left">
                    <div className={styles.infoCard}>
                        <h2>📍 Address</h2>
                        <p>St. Mary&apos;s Malankara Orthodox Syrian Church</p>
                        <p>{settings.contact.addressLine1}</p>
                        <p>{settings.contact.addressLine2}</p>
                        <a
                            href="https://maps.app.goo.gl/qi8XaMVmmYGMwbtG7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="parish-btn parish-btn-primary"
                            style={{ display: 'inline-flex', marginTop: '0.75rem', textDecoration: 'none', borderRadius: '12px', fontFamily: "'Poppins', sans-serif" }}
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
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2} direction="right">
                    <div className={styles.mapContainer}>
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
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
