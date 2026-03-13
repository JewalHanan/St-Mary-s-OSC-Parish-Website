'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    getGallerySections,
    saveGallerySections,
    nextId,
    type GallerySection,
    type GalleryImage,
} from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

// ── Shared input style ────────────────────────────────────────────
const inp: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid rgba(255,215,0,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--color-ivory)',
    fontSize: '1rem',
    width: '100%',
};

// ── Read original image without compression ──────────────────────
function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
}

export default function GalleryManager() {
    const [sections, setSections] = useState<GallerySection[]>([]);

    // Section modal state
    const [sectionModal, setSectionModal] = useState<{ id: number | null; name: string } | null>(null);

    // Image caption editing
    const [editCaption, setEditCaption] = useState<{ sectionId: number; imageId: number; value: string } | null>(null);

    // Upload state
    const [uploading, setUploading] = useState<number | null>(null); // section id currently uploading for
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadForSection = useRef<number | null>(null);

    useEffect(() => { getGallerySections().then(setSections); }, []);

    const persist = async (updated: GallerySection[]) => {
        setSections(updated);
        await saveGallerySections(updated);
    };

    // ── Section CRUD ──────────────────────────────────────────────
    const openAddSection = () => setSectionModal({ id: null, name: '' });
    const openEditSection = (s: GallerySection) => setSectionModal({ id: s.id, name: s.name });

    const saveSection = async () => {
        if (!sectionModal || !sectionModal.name.trim()) return alert('Section name is required.');
        if (sectionModal.id === null) {
            await persist([...sections, { id: nextId(sections), name: sectionModal.name.trim(), images: [] }]);
        } else {
            await persist(sections.map(s => s.id === sectionModal.id ? { ...s, name: sectionModal.name.trim() } : s));
        }
        setSectionModal(null);
    };

    const deleteSection = (id: number) => {
        if (!confirm('Delete this section and all its photos?')) return;
        persist(sections.filter(s => s.id !== id));
    };

    // ── Bulk image upload ─────────────────────────────────────────
    const triggerUpload = (sectionId: number) => {
        uploadForSection.current = sectionId;
        fileInputRef.current?.click();
    };

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = '';
        if (!files.length || uploadForSection.current === null) return;

        const sid = uploadForSection.current;
        setUploading(sid);

        const processed = await Promise.all(
            files.filter(f => f.type.startsWith('image/')).map(async (file) => {
                const url = await readFileAsDataURL(file);
                return { id: 0, url, caption: '' };
            })
        );

        setSections(prev => {
            const updated = prev.map(s => {
                if (s.id !== sid) return s;
                let nextImgId = s.images.length > 0 ? Math.max(...s.images.map(i => i.id)) + 1 : 1;
                const newImages: GalleryImage[] = processed.map(img => ({ ...img, id: nextImgId++ }));
                return { ...s, images: [...s.images, ...newImages] };
            });
            saveGallerySections(updated);
            return updated;
        });

        setUploading(null);
    };

    // ── Delete image ──────────────────────────────────────────────
    const deleteImage = (sectionId: number, imageId: number) => {
        if (!confirm('Remove this photo?')) return;
        persist(sections.map(s =>
            s.id !== sectionId ? s : { ...s, images: s.images.filter(i => i.id !== imageId) }
        ));
    };

    // ── Save caption ──────────────────────────────────────────────
    const saveCaption = () => {
        if (!editCaption) return;
        persist(sections.map(s =>
            s.id !== editCaption.sectionId ? s : {
                ...s,
                images: s.images.map(i => i.id !== editCaption.imageId ? i : { ...i, caption: editCaption.value })
            }
        ));
        setEditCaption(null);
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Gallery Manager</h1>
                    <p>Create sections and upload photos. Changes are immediately live on the public gallery page.</p>
                </div>
                <Button variant="primary" onClick={openAddSection}>➕ Add Section</Button>
            </header>

            {/* Hidden shared file input for bulk upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFiles}
            />

            {sections.length === 0 && (
                <Card className={styles.tableCard} style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        No gallery sections yet. Click "➕ Add Section" to get started.
                    </p>
                </Card>
            )}

            {sections.map(section => (
                <Card key={section.id} className={styles.tableCard} style={{ marginBottom: '1.5rem' }}>
                    {/* Section header row */}
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(255,215,0,0.1)',
                    }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', margin: 0, fontSize: '1.3rem' }}>
                            🖼️ {section.name}
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body-system)', marginLeft: '0.5rem' }}>
                                ({section.images.length} photo{section.images.length !== 1 ? 's' : ''})
                            </span>
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {uploading === section.id && (
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-accent)' }}>⏳ Uploading…</span>
                            )}
                            <Button variant="outline" onClick={() => triggerUpload(section.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                📷 Upload Photos
                            </Button>
                            <Button variant="outline" onClick={() => openEditSection(section)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                Rename
                            </Button>
                            <Button variant="secondary" onClick={() => deleteSection(section.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                Delete Section
                            </Button>
                        </div>
                    </div>

                    {/* Image thumbnail grid */}
                    {section.images.length === 0 ? (
                        <p style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                            No photos yet. Click "📷 Upload Photos" to add images.
                        </p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: '10px',
                            padding: '1.25rem 1.5rem',
                        }}>
                            {section.images.map(img => (
                                <div
                                    key={img.id}
                                    style={{
                                        position: 'relative',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,215,0,0.1)',
                                        aspectRatio: '4/3',
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.url}
                                        alt={img.caption || 'Gallery image'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                    {/* Actions overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.55)',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        padding: '8px',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                        onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                                    >
                                        <button
                                            onClick={() => setEditCaption({ sectionId: section.id, imageId: img.id, value: img.caption || '' })}
                                            style={{
                                                background: 'rgba(255,215,0,0.85)', border: 'none', borderRadius: '4px',
                                                padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer', color: '#000', width: '100%',
                                            }}
                                        >✏️ Caption</button>
                                        <button
                                            onClick={() => deleteImage(section.id, img.id)}
                                            style={{
                                                background: 'rgba(220,50,47,0.85)', border: 'none', borderRadius: '4px',
                                                padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer', color: '#fff', width: '100%',
                                            }}
                                        >🗑 Remove</button>
                                    </div>
                                    {img.caption && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'rgba(0,0,0,0.6)',
                                            color: '#fff',
                                            fontSize: '0.65rem',
                                            padding: '3px 6px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {img.caption}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            ))}

            {/* Section name modal */}
            {sectionModal !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '420px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.25rem' }}>
                            {sectionModal.id === null ? 'Add Section' : 'Rename Section'}
                        </h2>
                        <input
                            value={sectionModal.name}
                            onChange={e => setSectionModal({ ...sectionModal, name: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && saveSection()}
                            placeholder="Section name (e.g. Easter 2024)"
                            style={inp}
                            autoFocus
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setSectionModal(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveSection}>Save</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Caption modal */}
            {editCaption && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '420px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.25rem' }}>Edit Caption</h2>
                        <input
                            value={editCaption.value}
                            onChange={e => setEditCaption({ ...editCaption, value: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && saveCaption()}
                            placeholder="Caption (optional)"
                            style={inp}
                            autoFocus
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setEditCaption(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveCaption}>Save</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
