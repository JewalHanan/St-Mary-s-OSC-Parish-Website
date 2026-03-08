'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSliderImages, saveSliderImages, nextId, type SliderImage } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

import { validateImageFile } from '@/lib/uploadValidation';

export default function SliderManager() {
    const [images, setImages] = useState<SliderImage[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ image: '', title: '', caption: '' });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setImages(getSliderImages()); }, []);

    const persist = (updated: SliderImage[]) => {
        try {
            setImages(updated);
            saveSliderImages(updated);
        } catch {
            alert('Storage limit reached. Please delete an existing slide before adding more.');
        }
    };

    const openAdd = () => {
        setEditingId(0);
        setForm({ image: '', title: '', caption: '' });
    };

    const openEdit = (img: SliderImage) => {
        setEditingId(img.id);
        setForm({ image: img.image, title: img.title, caption: img.caption });
    };

    /**
     * Upload + auto-crop to 16:9 landscape.
     * Center-crops to 16:9, outputs max 1280×720px.
     */
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validationError = validateImageFile(file);
        if (validationError) { alert(validationError); e.target.value = ''; return; }
        setUploading(true);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const TARGET_W = Math.min(1280, img.width);
                const TARGET_H = Math.round(TARGET_W * (9 / 16)); // 16:9 → h = w × 0.5625

                // Center-crop source to 16:9
                const srcAspect = img.width / img.height;
                const targetAspect = 16 / 9;
                let sx = 0, sy = 0, sw = img.width, sh = img.height;
                if (srcAspect > targetAspect) {
                    sw = Math.round(img.height * targetAspect);
                    sx = Math.round((img.width - sw) / 2);
                } else {
                    sh = Math.round(img.width / targetAspect);
                    sy = Math.round((img.height - sh) / 2);
                }

                const canvas = document.createElement('canvas');
                canvas.width = TARGET_W;
                canvas.height = TARGET_H;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);
                const compressed = canvas.toDataURL('image/jpeg', 0.78);
                setForm(prev => ({ ...prev, image: compressed }));
                setUploading(false);
            };
            img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const save = () => {
        if (!form.title || !form.image) return alert('Title and an image are required.');
        if (editingId === 0) {
            persist([...images, { id: nextId(images), ...form }]);
        } else {
            persist(images.map(i => i.id === editingId ? { ...i, ...form } : i));
        }
        setEditingId(null);
    };

    const remove = (id: number) => {
        if (confirm('Delete this slide?')) persist(images.filter(i => i.id !== id));
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '6px',
        border: '1px solid rgba(255,215,0,0.2)',
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--color-ivory)', fontSize: '1rem', width: '100%',
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Homepage Image Slider</h1>
                    <p>Manage the images shown on the homepage slider. Changes are live instantly.</p>
                </div>
                <Button variant="primary" onClick={openAdd}>➕ Add Image</Button>
            </header>

            <Card className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Preview</th>
                                <th>Title</th>
                                <th>Caption</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {images.map(img => (
                                <tr key={img.id}>
                                    <td>
                                        <img src={img.image} alt={img.title} style={{ width: '120px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>{img.title}</td>
                                    <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{img.caption}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button variant="outline" onClick={() => openEdit(img)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</Button>
                                            <Button variant="secondary" onClick={() => remove(img.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {images.length === 0 && (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No images. Add one above.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add / Edit Modal */}
            {editingId !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '580px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
                            {editingId === 0 ? 'Add New Slide' : 'Edit Slide'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Upload from PC */}
                            <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem' }}>
                                Upload Image from PC
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: '2px dashed rgba(255,215,0,0.3)', borderRadius: '8px',
                                    padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.03)',
                                }}
                            >
                                {uploading ? (
                                    <p style={{ margin: 0, color: 'var(--color-gold)' }}>⏳ Compressing image…</p>
                                ) : form.image ? (
                                    <img
                                        src={form.image}
                                        alt="preview"
                                        style={{ maxHeight: '120px', maxWidth: '100%', borderRadius: '6px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <>
                                        <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)' }}>🖼️ Click to upload from PC</p>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>JPG, PNG, WebP — auto-compressed for fast loading</p>
                                    </>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>OR paste URL</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            </div>

                            <input
                                value={form.image.startsWith('data:') ? '' : form.image}
                                onChange={e => setForm({ ...form, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                style={inputStyle}
                            />

                            <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem' }}>Slide Title *</label>
                            <input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Sacred Heritage"
                                style={inputStyle}
                            />

                            <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem' }}>Caption (optional)</label>
                            <input
                                value={form.caption}
                                onChange={e => setForm({ ...form, caption: e.target.value })}
                                placeholder="A short description…"
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button variant="primary" onClick={save}>Save Slide</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
