'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getParishHistory, saveParishHistory, nextId, type ParishHistory, type HistoryImage } from '@/lib/store';
import styles from '@/styles/AdminDashboard.module.css';

export default function AdminHistoryPage() {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<HistoryImage[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const imgInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getParishHistory().then(history => {
            setContent(history.content);
            setImages(history.images ?? []);
            setIsLoading(false);
        }).catch(() => {
            setMessage({ text: 'Failed to load history', type: 'error' });
            setIsLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ text: '', type: '' });
        try {
            await saveParishHistory({ content, images });
            setMessage({ text: 'History successfully updated!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch {
            setMessage({ text: 'Failed to save history. Please try again.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // Convert uploaded file into a 16:9 base64 JPEG thumbnail
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const W = 960, H = 540; // target 16:9
                    const canvas = document.createElement('canvas');
                    canvas.width = W; canvas.height = H;
                    const ctx = canvas.getContext('2d')!;
                    // center-crop to 16:9
                    const srcAspect = img.width / img.height;
                    const tgtAspect = W / H;
                    let sx = 0, sy = 0, sw = img.width, sh = img.height;
                    if (srcAspect > tgtAspect) {
                        sw = img.height * tgtAspect;
                        sx = (img.width - sw) / 2;
                    } else {
                        sh = img.width / tgtAspect;
                        sy = (img.height - sh) / 2;
                    }
                    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
                    const url = canvas.toDataURL('image/jpeg', 0.85);
                    setImages(prev => [...prev, { id: nextId(prev), url, caption: '' }]);
                };
                img.src = ev.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const updateCaption = (id: number, caption: string) =>
        setImages(prev => prev.map(img => img.id === id ? { ...img, caption } : img));

    const removeImage = (id: number) =>
        setImages(prev => prev.filter(img => img.id !== id));

    if (isLoading) {
        return (
            <div className={styles.dashboardContainer}>
                <div className={styles.header}><h1 className={styles.title}>Parish History</h1></div>
                <Card><p>Loading editor...</p></Card>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Parish History Editor</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Edit the history of the church displayed publicly. Use standard HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;h2&gt;, &lt;p&gt;, and &lt;ul&gt;. Images below are displayed in 16:9 on the public page.
                </p>
            </div>

            {/* Text editor */}
            <Card style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontWeight: 'bold', color: 'var(--text-accent)' }}>History Content (HTML Supported)</label>
                    <textarea
                        className="styled-input"
                        style={{ minHeight: '400px', fontFamily: 'monospace', lineHeight: '1.5' }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="<p>Enter the parish history here...</p>"
                    />
                </div>
            </Card>

            {/* Image upload section */}
            <Card style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <label style={{ fontWeight: 'bold', color: 'var(--text-accent)', fontSize: '1.1rem' }}>
                        📸 History Images ({images.length})
                    </label>
                    <button
                        type="button"
                        onClick={() => imgInputRef.current?.click()}
                        style={{
                            padding: '9px 18px', borderRadius: '8px', cursor: 'pointer',
                            background: 'var(--input-bg)', border: '1px solid var(--card-border)',
                            color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem',
                        }}
                    >
                        ➕ Upload Image(s)
                    </button>
                    <input
                        ref={imgInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                </div>

                {images.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                        No images uploaded yet. Click &quot;Upload Image(s)&quot; above to add history photos.
                    </p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                        {images.map(img => (
                            <div key={img.id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)', background: 'var(--input-bg)' }}>
                                {/* 16:9 image preview */}
                                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={img.url}
                                        alt={img.caption || 'History image'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                                <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input
                                        className="styled-input"
                                        placeholder="Add a caption (optional)"
                                        value={img.caption ?? ''}
                                        onChange={e => updateCaption(img.id, e.target.value)}
                                        style={{ fontSize: '0.875rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img.id)}
                                        style={{
                                            color: '#ff6b6b', background: 'transparent',
                                            border: '1px solid rgba(255,107,107,0.3)',
                                            borderRadius: '6px', cursor: 'pointer',
                                            padding: '5px 10px', fontSize: '0.8rem', fontWeight: 600,
                                        }}
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Save & status */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                {message.text && (
                    <span style={{ color: message.type === 'success' ? '#2e7d32' : 'var(--accent-secondary)', fontWeight: 'bold' }}>
                        {message.text}
                    </span>
                )}
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : '💾 Save All Changes'}
                </Button>
            </div>

            {/* Live preview */}
            <Card style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Live Preview</h3>
                <div style={{ padding: '1.5rem', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', minHeight: '200px' }}>
                    {content ? <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content }} /> : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Preview will appear here...</p>
                    )}
                    {images.length > 0 && (
                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {images.map(img => (
                                <div key={img.id} style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                                        <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    {img.caption && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center' }}>{img.caption}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
