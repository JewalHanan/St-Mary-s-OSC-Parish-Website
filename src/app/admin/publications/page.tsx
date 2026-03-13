'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getPublications, savePublications, nextId, type Publication } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

const inp: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid rgba(255,215,0,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--color-ivory)',
    fontSize: '1rem',
    width: '100%',
};

const EMPTY_FORM = { name: '', description: '', fileUrl: '', fileName: '' };

export default function PublicationsManager() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [modal, setModal] = useState<{ pub: Partial<Publication> } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const pdfInputRef = useRef<HTMLInputElement>(null);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const fetchPubs = async () => {
        try {
            const data = await getPublications();
            setPublications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch publications', error);
        }
    };

    useEffect(() => {
        fetchPubs();
    }, []);

    const uploadFile = async (file: File, prefix: string): Promise<string | null> => {
        if (!file) return null;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('prefix', prefix);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            return data.url;
        } catch (error) {
            console.error('Upload Error:', error);
            showMessage('Failed to upload file. Please try again.', 'error');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const openAdd = () => setModal({ pub: { ...EMPTY_FORM } });
    const openEdit = (pub: Publication) => setModal({ pub: { ...pub } });

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') return showMessage('Please select a PDF file.', 'error');
        
        const url = await uploadFile(file, 'publications');
        if (url) {
            setModal(prev => prev ? {
                pub: { ...prev.pub, fileUrl: url, fileName: file.name }
            } : prev);
            showMessage('PDF uploaded temporarily. Save to finalize.', 'success');
        }
        e.target.value = '';
    };

    const save = async () => {
        if (!modal) return;
        const { name, description, fileUrl, fileName } = modal.pub;
        if (!name?.trim()) return showMessage('Publication name is required.', 'error');
        if (!description?.trim()) return showMessage('Description is required.', 'error');
        if (!fileUrl?.trim()) return showMessage('A PDF file or URL link is required.', 'error');

        setIsSaving(true);
        try {
            let updated: Publication[];
            if (modal.pub.id) {
                // Edit existing
                updated = publications.map(p =>
                    p.id === modal.pub.id
                        ? { ...p, name: name!.trim(), description: description!.trim(), fileUrl: fileUrl!, fileName: fileName || '' }
                        : p
                );
            } else {
                // Add new
                const newPub: Publication = {
                    id: nextId(publications),
                    name: name!.trim(),
                    description: description!.trim(),
                    fileUrl: fileUrl!,
                    fileName: fileName || '',
                };
                updated = [...publications, newPub];
            }
            await savePublications(updated);
            setPublications(updated);
            showMessage('Publication saved successfully.', 'success');
            setModal(null);
        } catch (error) {
            showMessage('Failed to save publication.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const deletePub = async (id: number) => {
        if (!confirm('Delete this publication?')) return;
        try {
            const updated = publications.filter(p => p.id !== id);
            await savePublications(updated);
            setPublications(updated);
            showMessage('Publication deleted.', 'success');
        } catch (error) {
            showMessage('Failed to delete publication.', 'error');
        }
    };

    return (
        <div className={styles.managerContainer} style={{ position: 'relative' }}>
            {message && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold',
                    background: message.type === 'success' ? '#27AE60' : '#E74C3C', color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all 0.3s'
                }}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            <header className={styles.header}>
                <div>
                    <h1>Publications Manager</h1>
                    <p>Upload church publications and supplement papers as PDFs. Changes save instantly and are live on the public page.</p>
                </div>
                <Button variant="primary" onClick={openAdd}>➕ Add Publication</Button>
            </header>

            {publications.length === 0 ? (
                <Card className={styles.tableCard} style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        No publications yet. Click &quot;➕ Add Publication&quot; to upload your first PDF.
                    </p>
                </Card>
            ) : (
                <Card className={styles.tableCard}>
                    <div className={styles.tableResponsive}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>File</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publications.map(pub => (
                                    <tr key={pub.id}>
                                        <td style={{ fontWeight: 'bold' }}>{pub.name}</td>
                                        <td style={{ maxWidth: 260, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {pub.description}
                                        </td>
                                        <td>
                                            {pub.fileUrl
                                                ? <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#27AE60', fontSize: '0.85rem', textDecoration: 'underline' }}>✅ Open PDF</a>
                                                : <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No file</span>
                                            }
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                <Button variant="outline" onClick={() => openEdit(pub)} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</Button>
                                                <Button variant="secondary" onClick={() => deletePub(pub.id)} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>🗑️</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Add / Edit Modal */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '520px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.5rem' }}>
                            {modal.pub.id ? 'Edit Publication' : 'Add Publication'}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                value={modal.pub.name ?? ''}
                                onChange={e => setModal({ pub: { ...modal.pub, name: e.target.value } })}
                                placeholder="Publication Name *"
                                style={inp}
                                autoFocus
                            />

                            <textarea
                                value={modal.pub.description ?? ''}
                                onChange={e => setModal({ pub: { ...modal.pub, description: e.target.value } })}
                                placeholder="Short Description *"
                                rows={3}
                                style={{ ...inp, resize: 'vertical' }}
                            />

                            {/* PDF upload area */}
                            <div>
                                <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                                    Upload PDF File
                                </label>
                                <div
                                    onClick={() => !uploading && pdfInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed rgba(255,215,0,0.3)',
                                        borderRadius: '8px',
                                        padding: '1.5rem',
                                        textAlign: 'center',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        background: 'rgba(255,255,255,0.03)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {uploading ? (
                                        <p style={{ color: 'var(--text-accent)', margin: 0 }}>⏳ Uploading to Server…</p>
                                    ) : modal.pub.fileName ? (
                                        <p style={{ color: '#27AE60', margin: 0 }}>✅ {modal.pub.fileName}</p>
                                    ) : modal.pub.fileUrl ? (
                                        <p style={{ color: '#27AE60', margin: 0 }}>✅ PDF active — click to replace</p>
                                    ) : (
                                        <>
                                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>📄 Click to upload a PDF</p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>or enter a URL below</p>
                                        </>
                                    )}
                                </div>
                                <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: 'none' }} />
                            </div>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            </div>

                            <input
                                value={modal.pub.fileUrl ?? ''}
                                onChange={e => setModal({ pub: { ...modal.pub, fileUrl: e.target.value, fileName: '' } })}
                                placeholder="Paste a file URL (Google Drive, etc.)"
                                style={inp}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                            <Button variant="primary" onClick={save} disabled={isSaving || uploading}>{isSaving ? 'Saving...' : 'Save Publication'}</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
