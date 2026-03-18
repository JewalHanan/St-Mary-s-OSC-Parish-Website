'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { getEvents, type ChurchEvent } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';
import styles from '@/styles/UpcomingEvents.module.css';

export default function UpcomingEvents() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.2 });
    const { data: allEvents } = useStoreData(getEvents, [] as ChurchEvent[]);
    const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);

    const events = useMemo(() => {
        return [...allEvents]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 6);
    }, [allEvents]);

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
                                <Card withGlow className={styles.eventCard} style={{ padding: 0, overflow: 'hidden' }}>
                                    {event.icon ? (
                                        <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderBottom: `2px solid ${event.color}50` }}>
                                            <img src={event.icon} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        </div>
                                    ) : (
                                        <div style={{ width: '100%', aspectRatio: '16/9', background: event.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', borderBottom: `2px solid ${event.color}50` }}>
                                            📅
                                        </div>
                                    )}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 className={styles.eventTitle} style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', color: 'var(--text-primary)' }}>{event.title}</h3>
                                        <div style={{ margin: '0 0 1.5rem', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span className={styles.badge} style={{ background: event.color + '20', color: event.color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                {event.type.toUpperCase()}
                                            </span>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                📅 {event.date}
                                            </span>
                                        </div>
                                        <button className={styles.readMoreBtn} onClick={() => setSelectedEvent(event)}>Read More</button>
                                    </div>
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
                            background: 'var(--bg-secondary)',
                            border: `2px solid ${selectedEvent.color}50`,
                            borderRadius: '16px',
                            padding: '2rem',
                            maxWidth: '520px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            boxShadow: `0 10px 40px rgba(0,0,0,0.4)`
                        }}
                    >
                        <button
                            onClick={() => setSelectedEvent(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer', zIndex: 1 }}
                        >
                            ✕
                        </button>

                        {selectedEvent.icon ? (
                            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: `1px solid ${selectedEvent.color}50` }}>
                                <img src={selectedEvent.icon} alt={selectedEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </div>
                        ) : (
                            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', background: selectedEvent.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '1.5rem', border: `1px solid ${selectedEvent.color}50` }}>📅</div>
                        )}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading-system)', fontSize: '1.8rem', lineHeight: 1.2 }}>{selectedEvent.title}</h2>
                            <span style={{ display: 'inline-block', marginTop: '8px', background: selectedEvent.color + '20', color: selectedEvent.color, padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {selectedEvent.type}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                <span style={{ fontSize: '1.2rem' }}>📅</span>
                                <strong>Date:</strong> {selectedEvent.date}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                <span style={{ fontSize: '1.2rem' }}>⏰</span>
                                <strong>Time:</strong> {selectedEvent.time}
                            </div>
                            {selectedEvent.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                                    <strong>Location:</strong> {selectedEvent.location}
                                </div>
                            )}
                        </div>

                        {selectedEvent.description && (
                            <div style={{ background: 'var(--input-bg)', padding: '1.25rem', borderRadius: '8px', borderLeft: `4px solid ${selectedEvent.color}` }}>
                                <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {selectedEvent.description}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="parish-btn parish-btn-primary"
                            style={{ display: 'block', width: '100%', marginTop: '2rem', borderRadius: '12px', fontFamily: "'Poppins', sans-serif" }}
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </section>
    );
}
