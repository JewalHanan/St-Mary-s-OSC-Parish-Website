'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { getEvents, type ChurchEvent } from '@/lib/store';
import styles from '@/styles/UpcomingEvents.module.css';

export default function UpcomingEvents() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.2 });
    const [events, setEvents] = useState<ChurchEvent[]>([]);

    useEffect(() => {
        getEvents().then(setEvents);
    }, []);

    return (
        <section className={styles.section} ref={containerRef}>
            <div className={styles.container}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                >
                    Upcoming Events
                </motion.h2>

                <div className={styles.grid}>
                    {events.length === 0 ? (
                        <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
                            <p>No upcoming events currently scheduled.</p>
                        </div>
                    ) : (
                        events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, z: -100, y: 50 }}
                                animate={isInView ? { opacity: 1, z: 0, y: 0 } : { opacity: 0, z: -100, y: 50 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                            >
                                <Card withGlow className={styles.eventCard}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                                        {event.icon
                                            ? <img src={event.icon} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${event.color}`, flexShrink: 0 }} />
                                            : <span style={{ width: 40, height: 40, borderRadius: '50%', background: event.color + '30', border: `2px solid ${event.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📅</span>
                                        }
                                        <h3 className={styles.eventTitle} style={{ margin: 0 }}>{event.title}</h3>
                                    </div>
                                    <div style={{ margin: '0.5rem 0 1.5rem', display: 'flex', gap: '8px' }}>
                                        <span className={styles.badge} style={{ background: event.color + '20', color: event.color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {event.type.toUpperCase()}
                                        </span>
                                    </div>
                                    <button className={styles.readMoreBtn}>Read More</button>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
