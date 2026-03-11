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
    const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);

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
                                    <button className={styles.readMoreBtn} onClick={() => setSelectedEvent(event)}>Read More</button>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedEvent(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--color-navy)',
                            border: `2px solid ${selectedEvent.color}50`,
                            borderRadius: '16px',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            position: 'relative',
                            boxShadow: `0 10px 40px ${selectedEvent.color}20`
                        }}
                    >
                        <button
                            onClick={() => setSelectedEvent(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
                            {selectedEvent.icon
                                ? <img src={selectedEvent.icon} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${selectedEvent.color}` }} />
                                : <span style={{ width: 64, height: 64, borderRadius: '50%', background: selectedEvent.color + '30', border: `3px solid ${selectedEvent.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📅</span>
                            }
                            <div>
                                <h2 style={{ margin: 0, color: 'var(--color-gold)', fontFamily: 'var(--font-heading-system)', fontSize: '1.5rem', lineHeight: 1.2 }}>{selectedEvent.title}</h2>
                                <span style={{ display: 'inline-block', marginTop: '6px', background: selectedEvent.color + '20', color: selectedEvent.color, padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {selectedEvent.type}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-ivory)' }}>
                                <span style={{ fontSize: '1.2rem' }}>📅</span>
                                <strong>Date:</strong> {selectedEvent.date}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-ivory)' }}>
                                <span style={{ fontSize: '1.2rem' }}>⏰</span>
                                <strong>Time:</strong> {selectedEvent.time}
                            </div>
                            {selectedEvent.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-ivory)' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                                    <strong>Location:</strong> {selectedEvent.location}
                                </div>
                            )}
                        </div>

                        {selectedEvent.description && (
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px', borderLeft: `4px solid ${selectedEvent.color}` }}>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {selectedEvent.description}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedEvent(null)}
                            style={{ display: 'block', width: '100%', marginTop: '2rem', padding: '12px', background: 'var(--color-ivory)', color: 'var(--color-navy)', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </section>
    );
}
