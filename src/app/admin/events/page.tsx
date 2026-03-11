'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getEvents, saveEvents, nextId, type ChurchEvent } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

const MAX_EVENTS = 5;

export default function EventsManager() {
    const [events, setEvents] = useState<ChurchEvent[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ title: '', date: '', time: '', color: '#F5A623', type: 'feast', icon: '', description: '', location: '' });
    const iconInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { getEvents().then(setEvents); }, []);

    const persist = async (updated: ChurchEvent[]) => {
        setEvents(updated);
        await saveEvents(updated);
    };

    const openAdd = () => {
        if (events.length >= MAX_EVENTS) {
            return alert(`Maximum of ${MAX_EVENTS} events allowed on the homepage. Please delete one first.`);
        }
        setEditingId(0);
        setForm({ title: '', date: '', time: '', color: '#F5A623', type: 'feast', icon: '', description: '', location: '' });
    };

    const openEdit = (evt: ChurchEvent) => {
        setEditingId(evt.id);
        setForm({ title: evt.title, date: evt.date, time: evt.time, color: evt.color, type: evt.type, icon: evt.icon || '', description: evt.description || '', location: evt.location || '' });
    };

    // Compress icon to a small 80×80 square thumbnail
    const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const SIZE = 80;
                const canvas = document.createElement('canvas');
                canvas.width = SIZE; canvas.height = SIZE;
                const ctx = canvas.getContext('2d')!;
                // center-crop to square
                const minDim = Math.min(img.width, img.height);
                const sx = (img.width - minDim) / 2;
                const sy = (img.height - minDim) / 2;
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE);
                setForm(prev => ({ ...prev, icon: canvas.toDataURL('image/png') }));
            };
            img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const save = () => {
        if (!form.title || !form.date) return alert('Title and Date are required.');
        if (editingId === 0) {
            if (events.length >= MAX_EVENTS) return alert(`Maximum ${MAX_EVENTS} events allowed.`);
            persist([...events, { id: nextId(events), ...form }]);
        } else {
            persist(events.map(e => e.id === editingId ? { ...e, ...form } : e));
        }
        setEditingId(null);
    };

    const deleteEvent = (id: number) => {
        if (confirm('Delete this event?')) persist(events.filter(e => e.id !== id));
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '6px',
        border: '1px solid rgba(255,215,0,0.2)',
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--color-ivory)', fontSize: '1rem',
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Events & Calendar Manager</h1>
                    <p>
                        Add, edit, or remove parish events. ({events.length}/{MAX_EVENTS} used)
                        {events.length >= MAX_EVENTS && (
                            <span style={{ color: '#E74C3C', marginLeft: '0.5rem', fontWeight: 600 }}>
                                ⚠️ Maximum reached — delete an event to add more.
                            </span>
                        )}
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={openAdd}
                    style={{ opacity: events.length >= MAX_EVENTS ? 0.5 : 1 }}
                >
                    ➕ Add New Event
                </Button>
            </header>

            <Card className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Event Title</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id}>
                                    <td>
                                        {event.icon
                                            ? <img src={event.icon} alt="icon" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                                            : <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: event.color, display: 'inline-block' }} />}
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>{event.title}</td>
                                    <td>{event.date}</td>
                                    <td>{event.time}</td>
                                    <td style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{event.type}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button variant="outline" onClick={() => openEdit(event)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</Button>
                                            <Button variant="secondary" onClick={() => deleteEvent(event.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No events scheduled.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {editingId !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '500px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.5rem' }}>
                            {editingId === 0 ? 'Add New Event' : 'Edit Event'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event Title *" style={inputStyle} />

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                                <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="Time (e.g. 07:30 AM)" style={{ ...inputStyle, flex: 1 }} />
                            </div>

                            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" style={inputStyle} />

                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Event Description (optional)"
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <label style={{ color: 'var(--color-ivory)', fontSize: '0.9rem' }}>Color:</label>
                                <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: '50px', height: '35px', border: 'none', cursor: 'pointer' }} />
                                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, flex: 1 }}>
                                    <option value="feast">Feast</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="special">Special</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            {/* Icon image upload */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {form.icon
                                    ? <img src={form.icon} alt="icon preview" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                                    : <span style={{ fontSize: '2rem' }}>🎪</span>}
                                <button
                                    type="button"
                                    onClick={() => iconInputRef.current?.click()}
                                    style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '8px 14px' }}
                                >
                                    📷 {form.icon ? 'Change Icon' : 'Upload Icon (optional)'}
                                </button>
                                {form.icon && <button type="button" onClick={() => setForm(p => ({ ...p, icon: '' }))} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Remove</button>}
                                <input ref={iconInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleIconUpload} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button variant="primary" onClick={save}>Save</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
