'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { getSpecialDays, getEvents, type SpecialDay, type ChurchEvent } from '@/lib/store';
import styles from '@/styles/Calendar.module.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function CountdownTimer({ targetDay }: { targetDay: SpecialDay }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

    useEffect(() => {
        const calcTime = () => {
            const difference = new Date(`${targetDay.date}T00:00:00`).getTime() - new Date().getTime();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((difference / 1000 / 60) % 60),
                });
            }
        };
        calcTime();
        const timer = setInterval(calcTime, 60000);
        return () => clearInterval(timer);
    }, [targetDay.date]);

    const formattedDate = new Date(`${targetDay.date}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Card className={styles.countdownCard} withGlow>
            <div className={styles.countdownImage}>
                {targetDay.image ? (
                    <img src={targetDay.image} alt={targetDay.title} />
                ) : (
                    <div className={styles.countdownImageFallback}>⏳</div>
                )}
            </div>
            <div className={styles.countdownContent}>
                <div className={styles.countdownInfo}>
                    <h3>{targetDay.title}</h3>
                    <div className={styles.countdownDate}>{formattedDate}</div>
                    {targetDay.description && <div className={styles.countdownDesc}>{targetDay.description}</div>}
                </div>
                
                <div className={styles.countdownTimerBox}>
                    <div className={styles.timerUnit}>
                        <span className={styles.number}>{timeLeft.days}</span>
                        <span className={styles.label}>Days</span>
                    </div>
                    <div className={styles.timerUnit}>
                        <span className={styles.number}>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className={styles.label}>Hours</span>
                    </div>
                    <div className={styles.timerUnit}>
                        <span className={styles.number}>{String(timeLeft.mins).padStart(2, '0')}</span>
                        <span className={styles.label}>Mins</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

const TYPE_COLORS: Record<string, string> = {
    feast: '#F5A623',
    fast: '#7F8C8D',
    commemoration: '#9B59B6',
    regular: '#2980B9',
};
const TYPE_LABELS: Record<string, string> = {
    feast: '🕊️ Feast',
    fast: '🌑 Fast / Lent',
    commemoration: '✝️ Commemoration',
    regular: '📌 Regular',
};

export default function CalendarPage() {
    const currentMonthIndex = new Date().getMonth();
    const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
    const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
    const [events, setEvents] = useState<ChurchEvent[]>([]);
    const [selectedDayInfo, setSelectedDayInfo] = useState<{ day: SpecialDay } | null>(null);

    useEffect(() => {
        Promise.all([getSpecialDays(), getEvents()]).then(([days, evts]) => {
            setSpecialDays(days);
            setEvents(evts);
        });
    }, []);

    // Generate days for the selected month to render the grid
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, selectedMonth, 1).getDay();

    // Create an array for empty slots before the first day
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    // Create an array for the actual days
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Liturgical Calendar
                </motion.h1>
            </div>

            <div className={styles.countdowns}>
                {specialDays.filter(d => d.is_countdown_target).map(target => (
                    <div key={target.id} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                        <CountdownTimer targetDay={target} />
                    </div>
                ))}
            </div>

            <Card className={styles.calendarContainer}>
                <div className={styles.monthSelector}>
                    <div className={styles.monthScroll}>
                        {months.map((month, idx) => (
                            <button
                                key={month}
                                className={`${styles.monthBtn} ${selectedMonth === idx ? styles.activeMonth : ''}`}
                                onClick={() => setSelectedMonth(idx)}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.weekdays}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className={styles.weekday}>{day}</div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedMonth}
                        className={styles.daysGrid}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        {blanks.map(blank => (
                            <div key={`blank-${blank}`} className={styles.emptySlot}></div>
                        ))}
                        {days.map(day => {
                            const fullDate = `${year}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                            const specialDay = specialDays.find(d => d.date === fullDate);
                            const churchEvent = events.find(e => e.date === fullDate);

                            const isSunday = new Date(year, selectedMonth, day).getDay() === 0;
                            const hasEvent = !!specialDay || !!churchEvent;
                            const eventColor = churchEvent?.color || (specialDay ? '#F5A623' : undefined);

                            return (
                                <div
                                    key={day}
                                    className={`${styles.dayCell} ${hasEvent ? styles.hasEvent : ''} ${isSunday ? styles.sunday : ''}`}
                                    onClick={() => {
                                        if (specialDay) {
                                            setSelectedDayInfo({ day: specialDay });
                                        } else if (churchEvent) {
                                            // Wrap churchEvent as a minimal SpecialDay-like object for display
                                            setSelectedDayInfo({
                                                day: {
                                                    id: churchEvent.id,
                                                    title: churchEvent.title,
                                                    date: churchEvent.date,
                                                    description: churchEvent.type,
                                                    type: 'feast',
                                                    is_countdown_target: false,
                                                }
                                            });
                                        }
                                    }}
                                    style={{ cursor: hasEvent ? 'pointer' : 'default' }}
                                >
                                    <span className={styles.dateNum}>{day}</span>
                                    {isSunday && <div className={styles.sundayBadge}>✝</div>}

                                    {specialDay && (
                                        <div
                                            className={styles.eventIndicator}
                                            style={{ backgroundColor: TYPE_COLORS[specialDay.type ?? 'feast'] }}
                                            title={specialDay.title}
                                        />
                                    )}
                                    {churchEvent && !specialDay && (
                                        <div className={styles.eventIndicator} style={{ backgroundColor: churchEvent.color }} title={churchEvent.title} />
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </Card>

            {/* Clickable Info Modal for Special Days */}
            <AnimatePresence>
                {selectedDayInfo && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        onClick={() => setSelectedDayInfo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            style={{ background: 'var(--color-navy)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,215,0,0.2)', padding: '2.5rem', borderRadius: '16px', maxWidth: '500px', width: '100%', borderTop: `4px solid ${TYPE_COLORS[selectedDayInfo.day.type ?? 'feast']}` }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Image */}
                            {selectedDayInfo.day.image && (
                                <div style={{ width: '100%', height: '220px', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${TYPE_COLORS[selectedDayInfo.day.type ?? 'feast']}50` }}>
                                    <img
                                        src={selectedDayInfo.day.image}
                                        alt={selectedDayInfo.day.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                            )}
                            {/* Type badge */}
                            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', background: TYPE_COLORS[selectedDayInfo.day.type ?? 'feast'] + '25', color: TYPE_COLORS[selectedDayInfo.day.type ?? 'feast'], fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                                {TYPE_LABELS[selectedDayInfo.day.type ?? 'feast']}
                            </span>
                            <h2 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading-system)', fontSize: '1.6rem', lineHeight: 1.3 }}>
                                {selectedDayInfo.day.title}
                            </h2>
                            <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold', marginBottom: '1rem' }}>
                                {new Date(selectedDayInfo.day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            {selectedDayInfo.day.description && (
                                <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '1rem' }}>
                                    {selectedDayInfo.day.description}
                                </p>
                            )}
                            <button
                                onClick={() => setSelectedDayInfo(null)}
                                style={{ marginTop: '2rem', width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
