'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSpecialDays, type SpecialDay } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';
import { motion } from 'framer-motion';

interface TimeLeft {
    days: number;
    hours: number;
    mins: number;
    secs: number;
}

function useCountdown(dateStr: string): TimeLeft {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
    useEffect(() => {
        const calc = () => {
            const diff = new Date(`${dateStr}T00:00:00`).getTime() - Date.now();
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((diff / 1000 / 60) % 60),
                    secs: Math.floor((diff / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
            }
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [dateStr]);
    return timeLeft;
}

function CountdownTile({ event }: { event: SpecialDay }) {
    const timeLeft = useCountdown(event.date);

    const formattedDate = new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const units = [
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.mins, label: 'Mins' },
        { value: timeLeft.secs, label: 'Secs' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            style={{
                display: 'flex',
                flexDirection: 'row',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
                maxWidth: '960px',
                width: '100%',
                margin: '0 auto',
            }}
            className="main-countdown-tile"
        >
            {/* ── LEFT: 16:9 image ── */}
            <div
                style={{
                    width: '45%',
                    flexShrink: 0,
                    aspectRatio: '16/9',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRight: '2px solid var(--card-border)',
                }}
                className="main-countdown-image"
            >
                {event.image ? (
                    <img
                        src={event.image}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        background: 'radial-gradient(circle at 30% 50%, rgba(255,215,0,0.12) 0%, var(--color-navy) 70%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem',
                    }}>
                        ✝️
                    </div>
                )}
                {/* subtle gradient to blend into content */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, var(--card-bg) 100%)' }} />
            </div>

            {/* ── RIGHT: text + timer ── */}
            <div style={{ flex: 1, padding: 'clamp(1.5rem, 3vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                {/* Badge */}
                <span style={{
                    display: 'inline-block', alignSelf: 'flex-start',
                    padding: '4px 14px', borderRadius: '20px',
                    background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)',
                    color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                    Upcoming Feast
                </span>

                {/* Event name */}
                <h2 style={{
                    fontFamily: 'var(--font-heading-system)',
                    fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                    color: 'var(--text-primary)',
                    margin: 0, lineHeight: 1.2,
                }}>
                    {event.title.replace('✝️', '').trim()}
                </h2>

                {/* DATE — large & prominent */}
                <p style={{
                    fontFamily: 'var(--font-heading-system)',
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    margin: 0,
                    lineHeight: 1.3,
                }}>
                    {formattedDate}
                </p>

                {/* Description */}
                {event.description && (
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, maxWidth: '480px' }}>
                        {event.description}
                    </p>
                )}

                {/* Countdown timer */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {units.map((u, i) => (
                        <div key={i} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            background: 'var(--input-bg)', border: '1px solid var(--card-border)',
                            borderRadius: '12px', padding: '0.75rem 1rem', minWidth: '64px',
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-heading-system)',
                                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                                fontWeight: 700, color: 'var(--text-accent)', lineHeight: 1,
                            }}>
                                {String(u.value).padStart(2, '0')}
                            </span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                {u.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function MainCountdown() {
    const { data: allDays } = useStoreData(getSpecialDays, [] as SpecialDay[]);

    const targets = useMemo(() => {
        const now = Date.now();
        return allDays
            .filter(d => d.is_countdown_target && new Date(`${d.date}T00:00:00`).getTime() > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 2);
    }, [allDays]);

    if (targets.length === 0) return null;

    return (
        <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1rem', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center' }}
                >
                    <h2 style={{
                        fontFamily: 'var(--font-heading-system)',
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                    }}>
                        <span style={{ color: 'var(--accent-primary)' }}>✝</span> Upcoming Feasts & Observances
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Counting down to the next sacred events in our liturgical calendar.
                    </p>
                </motion.div>

                {/* Tiles */}
                {targets.map(t => <CountdownTile key={t.id} event={t} />)}
            </div>

            {/* Responsive override for image column */}
            <style>{`
                @media (max-width: 640px) {
                    .main-countdown-tile { flex-direction: column !important; }
                    .main-countdown-image { width: 100% !important; border-right: none !important; border-bottom: 2px solid var(--card-border) !important; }
                }
            `}</style>
        </section>
    );
}
