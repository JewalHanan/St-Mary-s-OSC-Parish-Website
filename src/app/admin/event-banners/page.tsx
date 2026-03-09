'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getEventBanners, saveEventBanners, nextId, type EventBannerImage } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';
import { validateImageFile } from '@/lib/uploadValidation';

/* ── 4:3 Crop helper ─────────────────────────────────────────────
   Renders the uploaded image on a canvas at exactly 4:3 and
   returns a base64 JPEG (max 800px wide, ~70% quality) */
// 2:3 portrait crop: center-crops uploaded image to 2:3 portrait
function cropTo2x3(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const validationError = validateImageFile(file);
        if (validationError) { reject(new Error(validationError)); return; }
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                // 2:3 portrait → height = width * 1.5
                const TARGET_W = Math.min(600, img.width);
                const TARGET_H = Math.round(TARGET_W * 1.5); // 2:3

                // Center-crop source to 2:3
                const srcAspect = img.width / img.height;
                const targetAspect = 2 / 3;
                let sx = 0, sy = 0, sw = img.width, sh = img.height;
                if (srcAspect > targetAspect) {
                    // Wider than 2:3 → crop left/right
                    sw = Math.round(img.height * targetAspect);
                    sx = Math.round((img.width - sw) / 2);
                } else {
                    // Taller than 2:3 → crop top/bottom
                    sh = Math.round(img.width / targetAspect);
                    sy = Math.round((img.height - sh) / 2);
                }

                const canvas = document.createElement('canvas');
                canvas.width = TARGET_W;
                canvas.height = TARGET_H;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);
                resolve(canvas.toDataURL('image/jpeg', 0.75));
            };
            img.onerror = reject;
            img.src = ev.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function EventBannersManager() {
    const [banners, setBanners] = useState<EventBannerImage[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editCaption, setEditCaption] = useState('');
    const [dragOver, setDragOver] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const dragSrcIdx = useRef<number | null>(null);

    useEffect(() => { getEventBanners().then(setBanners); }, []);

    const persist = async (updated: EventBannerImage[]) => {
        const withOrder = updated.map((b, i) => ({ ...b, order: i }));
        setBanners(withOrder);
        await saveEventBanners(withOrder);
    };

    /* ── Upload ── */
    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        const newBanners = [...banners];
        for (const file of Array.from(files)) {
            try {
                const dataUrl = await cropTo2x3(file);
                newBanners.push({
                    id: nextId(newBanners),
                    image: dataUrl,
                    caption: file.name.replace(/\.[^/.]+$/, ''), // default caption = filename
                    order: newBanners.length,
                });
            } catch {
                alert(`Could not process ${file.name}. Please use an image file.`);
            }
        }
        persist(newBanners);
        setUploading(false);
    };

    /* ── Caption edit inline ── */
    const startEdit = (b: EventBannerImage) => { setEditingId(b.id); setEditCaption(b.caption); };
    const saveCaption = (id: number) => {
        persist(banners.map(b => b.id === id ? { ...b, caption: editCaption } : b));
        setEditingId(null);
    };

    /* ── Delete ── */
    const handleDelete = (id: number) => {
        if (confirm('Remove this banner image?')) {
            persist(banners.filter(b => b.id !== id));
        }
    };

    /* ── Drag-and-drop reorder ── */
    const onDragStart = (idx: number) => { dragSrcIdx.current = idx; };
    const onDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        setDragOver(idx);
    };
    const onDrop = (dropIdx: number) => {
        const srcIdx = dragSrcIdx.current;
        if (srcIdx === null || srcIdx === dropIdx) { setDragOver(null); return; }
        const reordered = [...banners];
        const [moved] = reordered.splice(srcIdx, 1);
        reordered.splice(dropIdx, 0, moved);
        persist(reordered);
        dragSrcIdx.current = null;
        setDragOver(null);
    };
    const onDragEnd = () => { dragSrcIdx.current = null; setDragOver(null); };

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px', borderRadius: '6px',
        border: '1px solid var(--card-border)',
        background: 'var(--input-bg)',
        color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%',
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Event Banner Images</h1>
                    <p>Manage cinematic slider images shown on the public site. Drag to reorder. ({banners.length} images)</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button
                        variant="primary"
                        onClick={() => fileRef.current?.click()}
                        style={{ opacity: uploading ? 0.6 : 1 }}
                    >
                        {uploading ? '⏳ Processing…' : '📸 Upload Images'}
                    </Button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => handleFiles(e.target.files)}
                    />
                </div>
            </header>

            {/* Drop zone hint */}
            <div
                style={{
                    border: '2px dashed var(--card-border)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    transition: 'border-color 0.3s ease',
                }}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            >
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</p>
                <p>Click or drag &amp; drop images here to upload</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Auto-cropped to <strong>2:3 portrait</strong> — max 600×900px</p>
            </div>

            {banners.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                    No banner images yet. Upload some above!
                </p>
            )}

            {/* Grid of banner cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
            }}>
                {banners.map((banner, idx) => (
                    <div
                        key={banner.id}
                        style={{
                            padding: '0',
                            overflow: 'hidden',
                            cursor: 'grab',
                            border: dragOver === idx ? '2px solid var(--accent-primary)' : '1px solid var(--card-border)',
                            transition: 'border 0.2s ease, opacity 0.2s ease',
                            opacity: dragSrcIdx.current === idx ? 0.45 : 1,
                            borderRadius: '12px',
                            background: 'var(--card-bg)',
                            backdropFilter: 'blur(8px)',
                        }}
                        draggable
                        onDragStart={() => onDragStart(idx)}
                        onDragOver={(e: React.DragEvent) => onDragOver(e, idx)}
                        onDrop={() => onDrop(idx)}
                        onDragEnd={onDragEnd}
                    >
                        {/* 4:3 image preview */}
                        <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={banner.image}
                                alt={banner.caption}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {/* Order badge */}
                            <div style={{
                                position: 'absolute', top: '8px', left: '8px',
                                background: 'var(--accent-primary)', color: 'var(--color-navy)',
                                borderRadius: '6px', padding: '2px 8px',
                                fontWeight: 'bold', fontSize: '0.8rem',
                            }}>
                                #{idx + 1}
                            </div>
                            {/* Drag handle hint */}
                            <div style={{
                                position: 'absolute', top: '8px', right: '8px',
                                background: 'rgba(0,0,0,0.4)', color: '#fff',
                                borderRadius: '6px', padding: '2px 6px', fontSize: '0.8rem',
                            }}>
                                ⠿ Drag
                            </div>
                        </div>

                        {/* Caption editor */}
                        <div style={{ padding: '0.75rem 1rem 1rem' }}>
                            {editingId === banner.id ? (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <input
                                        value={editCaption}
                                        onChange={e => setEditCaption(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && saveCaption(banner.id)}
                                        style={{ ...inputStyle, fontSize: '0.85rem', padding: '6px 10px' }}
                                        autoFocus
                                    />
                                    <Button variant="primary" onClick={() => saveCaption(banner.id)} style={{ padding: '6px 10px', fontSize: '0.8rem', flexShrink: 0 }}>
                                        ✓
                                    </Button>
                                </div>
                            ) : (
                                <p
                                    style={{ color: 'var(--text-primary)', fontSize: '0.9rem', cursor: 'pointer', margin: 0 }}
                                    onClick={() => startEdit(banner)}
                                    title="Click to edit caption"
                                >
                                    ✏️ {banner.caption || <em style={{ color: 'var(--text-secondary)' }}>No caption — click to add</em>}
                                </p>
                            )}
                        </div>

                        {/* Delete */}
                        <div style={{ borderTop: '1px solid var(--card-border)', padding: '0.5rem 1rem' }}>
                            <Button
                                variant="secondary"
                                onClick={() => handleDelete(banner.id)}
                                style={{ width: '100%', padding: '6px', fontSize: '0.8rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}
                            >
                                🗑️ Remove Image
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
                💡 Drag cards to reorder. Changes save instantly and update the live slider on the public site.
            </p>
        </div>
    );
}
