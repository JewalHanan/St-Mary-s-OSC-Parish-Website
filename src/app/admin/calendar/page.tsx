'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSpecialDays, saveSpecialDays, nextId, type SpecialDay } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TYPE_LABELS: Record<string, string> = { feast: '🕊️ Feast', fast: '🌑 Fast', commemoration: '✝️ Commemoration', regular: '📌 Regular' };
const TYPE_COLORS: Record<string, string> = { feast: '#F5A623', fast: '#7F8C8D', commemoration: '#9B59B6', regular: '#2980B9' };

const emptyForm = () => ({
    title: '',
    date: '',
    description: '',
    type: 'feast' as SpecialDay['type'],
    image: '',
    is_countdown_target: false,
});

export default function CalendarManager() {
    const [days, setDays] = useState<SpecialDay[]>([]);
    const [viewYear, setViewYear] = useState(new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(new Date().getMonth()); // 0-indexed
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm());
    const [search, setSearch] = useState('');
    const imgInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { getSpecialDays().then(setDays); }, []);

    const persist = async (updated: SpecialDay[]) => {
        setDays(updated);
        await saveSpecialDays(updated);
    };

    // ── Month navigation ──────────────────────────────────────
    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // ── Days in current view ──────────────────────────────────
    const daysInView = days
        .filter(d => {
            const dt = new Date(d.date + 'T00:00:00');
            return dt.getFullYear() === viewYear && dt.getMonth() === viewMonth;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // ── Search across all months ──────────────────────────────
    const searchResults = search.trim().length >= 2
        ? days.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : null;

    const displayDays = searchResults ?? daysInView;

    // ── Image upload: 1:1 square crop ────────────────────────
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const SIZE = 200;
                const canvas = document.createElement('canvas');
                canvas.width = SIZE; canvas.height = SIZE;
                const ctx = canvas.getContext('2d')!;
                const minDim = Math.min(img.width, img.height);
                const sx = (img.width - minDim) / 2;
                const sy = (img.height - minDim) / 2;
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE);
                setForm(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.8) }));
            };
            img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // ── CRUD ─────────────────────────────────────────────────
    const openAdd = () => {
        // Pre-fill date to 1st of current view month
        const pad = (n: number) => String(n).padStart(2, '0');
        const dateStr = `${viewYear}-${pad(viewMonth + 1)}-01`;
        setEditingId(0);
        setForm({ ...emptyForm(), date: dateStr });
    };

    const openEdit = (d: SpecialDay) => {
        setEditingId(d.id);
        setForm({
            title: d.title,
            date: d.date,
            description: d.description,
            type: d.type ?? 'feast',
            image: d.image ?? '',
            is_countdown_target: d.is_countdown_target,
        });
    };

    const handleSave = () => {
        if (!form.title || !form.date) return alert('Title and Date are required.');
        let currentDays = [...days];
        if (form.is_countdown_target) {
            currentDays = currentDays.map(d => ({ ...d, is_countdown_target: false }));
        }
        if (editingId === 0) {
            persist([...currentDays, { id: nextId(currentDays), ...form }]);
        } else {
            persist(currentDays.map(d => d.id === editingId ? { ...d, ...form } : d));
        }
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this special day?')) persist(days.filter(d => d.id !== id));
    };

    const setAsCountdown = (id: number) => {
        persist(days.map(d => ({ ...d, is_countdown_target: d.id === id })));
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '6px',
        border: '1px solid var(--card-border)',
        background: 'var(--input-bg)', color: 'var(--text-primary)',
        fontSize: '1rem', width: '100%',
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Calendar Management</h1>
                    <p>Navigate month by month to view and edit special days, feasts, fasts, and commemorations. ({days.length} total entries)</p>
                </div>
                <Button variant="primary" onClick={openAdd}>➕ Add Day</Button>
            </header>

            {/* ── Search Bar ── */}
            <Card style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🔍</span>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search across all months (type 2+ characters)…"
                    style={{ ...inputStyle, margin: 0 }}
                />
                {search && <button onClick={() => setSearch('')} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>}
            </Card>

            {/* ── Month Navigator ── */}
            {!searchResults && (
                <Card style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button variant="outline" onClick={prevMonth} style={{ padding: '8px 16px' }}>◀ {viewMonth === 0 ? 'Dec' : MONTHS[viewMonth - 1].slice(0, 3)}</Button>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--color-gold)', margin: 0, fontFamily: 'var(--font-heading-system)' }}>{MONTHS[viewMonth]} {viewYear}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>{daysInView.length} special day{daysInView.length !== 1 ? 's' : ''} this month</p>
                    </div>
                    <Button variant="outline" onClick={nextMonth} style={{ padding: '8px 16px' }}>{viewMonth === 11 ? 'Jan' : MONTHS[viewMonth + 1].slice(0, 3)} ▶</Button>
                </Card>
            )}

            {/* ── Type Legend ── */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <span key={k} style={{ padding: '4px 12px', borderRadius: '20px', background: TYPE_COLORS[k] + '25', border: `1px solid ${TYPE_COLORS[k]}`, color: TYPE_COLORS[k], fontSize: '0.85rem', fontWeight: 600 }}>
                        {v}
                    </span>
                ))}
            </div>

            {/* ── Edit / Add Modal ── */}
            {editingId !== null && (
                <Card style={{ marginBottom: '2rem', background: 'var(--card-bg)', padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-gold)' }}>
                        {editingId === 0 ? '➕ Add Special Day' : '✏️ Edit Special Day'}
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                        {/* Title */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Title *</label>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Feast of St. George" style={inputStyle} />
                        </div>
                        {/* Date */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date *</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                        </div>
                        {/* Type */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Type</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as SpecialDay['type'] })} style={inputStyle}>
                                <option value="feast">🕊️ Feast</option>
                                <option value="fast">🌑 Fast / Lent</option>
                                <option value="commemoration">✝️ Commemoration</option>
                                <option value="regular">📌 Regular / National</option>
                            </select>
                        </div>
                        {/* Description */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description of significance…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                        </div>
                        {/* Image upload 1:1 */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>📸 Image (1:1 square, optional)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {form.image
                                    ? <img src={form.image} alt="preview" style={{ width: 64, height: 64, borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--accent-primary)', flexShrink: 0 }} />
                                    : <span style={{ width: 64, height: 64, borderRadius: '10px', background: 'var(--input-bg)', border: '2px dashed var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🖼️</span>
                                }
                                <button type="button" onClick={() => imgInputRef.current?.click()} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '8px 14px' }}>
                                    {form.image ? '🔄 Change Image' : '📷 Upload Image'}
                                </button>
                                {form.image && <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Remove</button>}
                                <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                            </div>
                        </div>
                        {/* Countdown */}
                        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="checkbox" id="countdownCheck" checked={form.is_countdown_target} onChange={e => setForm({ ...form, is_countdown_target: e.target.checked })} style={{ width: 20, height: 20 }} />
                            <label htmlFor="countdownCheck" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>⭐ Set as active Homepage Countdown target</label>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <Button variant="primary" onClick={handleSave}>💾 Save</Button>
                        <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                </Card>
            )}

            {/* ── Days List ── */}
            {displayDays.length === 0 ? (
                <Card style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {searchResults !== null ? 'No results found.' : `No special days recorded for ${MONTHS[viewMonth]} ${viewYear}.`}
                    </p>
                    <Button variant="primary" onClick={openAdd}>➕ Add a Day</Button>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {displayDays.map(day => {
                        const dt = new Date(day.date + 'T00:00:00');
                        const dayNum = dt.getDate();
                        const monthAbbr = MONTHS[dt.getMonth()].slice(0, 3);
                        const typeColor = TYPE_COLORS[day.type ?? 'feast'];
                        return (
                            <Card key={day.id} style={{ background: 'var(--card-bg)', padding: '1rem 1.25rem', borderLeft: `4px solid ${typeColor}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    {/* Date badge */}
                                    <div style={{ minWidth: 52, textAlign: 'center', background: typeColor + '20', borderRadius: '8px', padding: '4px 8px', flexShrink: 0 }}>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: typeColor, lineHeight: 1 }}>{dayNum}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{monthAbbr}</div>
                                    </div>

                                    {/* Image if present */}
                                    {day.image && <img src={day.image} alt={day.title} style={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: `2px solid ${typeColor}` }} />}

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 180 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{day.title}</span>
                                            <span style={{ padding: '2px 8px', borderRadius: '12px', background: typeColor + '25', color: typeColor, fontSize: '0.75rem', fontWeight: 600 }}>
                                                {TYPE_LABELS[day.type ?? 'feast']}
                                            </span>
                                            {day.is_countdown_target && <span style={{ color: '#F5A623', fontSize: '0.85rem' }}>⭐ Countdown</span>}
                                        </div>
                                        {day.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0', lineHeight: 1.4 }}>{day.description.length > 100 ? day.description.slice(0, 100) + '…' : day.description}</p>}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                        {!day.is_countdown_target && (
                                            <Button variant="outline" onClick={() => setAsCountdown(day.id)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>⭐</Button>
                                        )}
                                        <Button variant="secondary" onClick={() => openEdit(day)} style={{ padding: '4px 8px' }}>✏️</Button>
                                        <Button variant="outline" onClick={() => handleDelete(day.id)} style={{ padding: '4px 8px', borderColor: '#ff6b6b', color: '#ff6b6b' }}>🗑️</Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
