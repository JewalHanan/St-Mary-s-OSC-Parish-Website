'use client';

import { useState, useEffect } from 'react';
import { getSpecialDays, type SpecialDay } from '@/lib/store';
import { motion } from 'framer-motion';

export default function MainCountdown() {
    const [targetDay, setTargetDay] = useState<SpecialDay | null>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        getSpecialDays().then(days => {
            const targets = days.filter(d => d.is_countdown_target);
            const futureTargets = targets.filter(d => new Date(`${d.date}T00:00:00`).getTime() > new Date().getTime());
            futureTargets.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            if (futureTargets.length > 0) {
                setTargetDay(futureTargets[0]);
            } else if (targets.length > 0) {
                // Fallback to the last one if all are in past
                setTargetDay(targets[targets.length - 1]);
            }
        });
    }, []);

    useEffect(() => {
        if (!targetDay) return;
        const calcTime = () => {
            const difference = new Date(`${targetDay.date}T00:00:00`).getTime() - new Date().getTime();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((difference / 1000 / 60) % 60),
                    secs: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
            }
        };
        calcTime();
        const timer = setInterval(calcTime, 1000);
        return () => clearInterval(timer);
    }, [targetDay]);

    if (!targetDay) return null;

    const formattedDate = new Date(`${targetDay.date}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <section style={{ position: 'relative', width: '100%', padding: '6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--color-navy)' }}>
            {targetDay.image && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <img src={targetDay.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-navy) 10%, rgba(10, 25, 47, 0.7) 100%)' }} />
                </div>
            )}
            {!targetDay.image && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, var(--color-navy) 70%)' }} />
            )}

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255, 215, 0, 0.15)', border: '1px solid rgba(255, 215, 0, 0.3)', color: 'var(--text-accent)', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        Upcoming Special Day
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-heading-system)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--color-ivory)', marginBottom: '0.5rem', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                        {targetDay.title}
                    </h2>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-accent)', fontWeight: 'bold', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {formattedDate}
                    </p>
                    {targetDay.description && (
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                            {targetDay.description}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                            { value: timeLeft.days, label: 'Days' },
                            { value: timeLeft.hours, label: 'Hours' },
                            { value: timeLeft.mins, label: 'Minutes' },
                            { value: timeLeft.secs, label: 'Seconds' }
                        ].map((unit, idx) => (
                            <div key={idx} style={{ background: 'rgba(10, 25, 47, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: '16px', padding: '1.5rem', minWidth: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                                <span style={{ fontFamily: 'var(--font-heading-system)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-accent)', lineHeight: 1, marginBottom: '0.5rem' }}>
                                    {String(unit.value).padStart(2, '0')}
                                </span>
                                <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {unit.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
