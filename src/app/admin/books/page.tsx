'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBookSections, saveBookSections, nextId, type BookSection, type BookItem } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

export default function BooksManager() {
    const [sections, setSections] = useState<BookSection[]>([]);
    const [editingSectionId, setEditingSectionId] = useState<number | 'new' | null>(null);
    const [sectionTitle, setSectionTitle] = useState('');
    const [sectionImage, setSectionImage] = useState('');
    
    const [editingBook, setEditingBook] = useState<{ sectionId: number; bookId: number | null } | null>(null);
    const [bookForm, setBookForm] = useState({ title: '', language: 'Malayalam', fileUrl: '', fileName: '', image: '' });
    
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const pdfInputRef = useRef<HTMLInputElement>(null);
    const imgInputRef = useRef<HTMLInputElement>(null);
    const sectionImgInputRef = useRef<HTMLInputElement>(null);

    const fetchSections = async () => {
        try {
            const data = await getBookSections();
            setSections(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch sections', error);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

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

    // ── Section CRUD ──
    const addSection = () => { setEditingSectionId('new'); setSectionTitle(''); setSectionImage(''); };
    const editSection = (s: BookSection) => { setEditingSectionId(s.id); setSectionTitle(s.title); setSectionImage(s.image || ''); };
    
    const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadFile(file, 'sections');
        if (url) {
            setSectionImage(url);
            showMessage('Section image uploaded temporarily. Save to finalize.', 'success');
        }
        e.target.value = '';
    };

    const saveSection = async () => {
        if (!sectionTitle) return showMessage('Title is required.', 'error');
        setIsSaving(true);
        try {
            let updated: BookSection[];
            if (editingSectionId === 'new') {
                const newSection: BookSection = {
                    id: nextId(sections),
                    title: sectionTitle,
                    image: sectionImage || undefined,
                    books: [],
                };
                updated = [...sections, newSection];
            } else {
                updated = sections.map(s =>
                    s.id === editingSectionId
                        ? { ...s, title: sectionTitle, image: sectionImage || undefined }
                        : s
                );
            }
            await saveBookSections(updated);
            setSections(updated);
            showMessage('Section saved successfully.', 'success');
            setEditingSectionId(null);
        } catch (error) {
            showMessage('Failed to save section.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteSection = async (id: number) => {
        if (!confirm('Delete this section and all its books?')) return;
        try {
            const updated = sections.filter(s => s.id !== id);
            await saveBookSections(updated);
            setSections(updated);
            showMessage('Section deleted.', 'success');
        } catch (error) {
            showMessage('Failed to delete section.', 'error');
        }
    };

    // ── Book CRUD ──
    const openAddBook = (sectionId: number) => {
        setEditingBook({ sectionId, bookId: null });
        setBookForm({ title: '', language: 'Malayalam', fileUrl: '', fileName: '', image: '' });
    };
    const openEditBook = (sectionId: number, book: BookItem) => {
        setEditingBook({ sectionId, bookId: book.id });
        setBookForm({ title: book.title, language: book.language, fileUrl: book.fileUrl, fileName: '', image: book.image || '' });
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') return showMessage('Please select a PDF file.', 'error');
        const url = await uploadFile(file, 'books');
        if (url) {
            setBookForm(prev => ({ ...prev, fileUrl: url, fileName: file.name }));
            showMessage('PDF uploaded. Save to finalize.', 'success');
        }
        e.target.value = '';
    };

    const handleBookImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadFile(file, 'thumbnails');
        if (url) {
            setBookForm(prev => ({ ...prev, image: url }));
            showMessage('Thumbnail uploaded. Save to finalize.', 'success');
        }
        e.target.value = '';
    };

    const saveBook = async () => {
        if (!bookForm.title || !editingBook) return showMessage('Book title is required.', 'error');
        if (!bookForm.fileUrl) return showMessage('A PDF file or URL link is required.', 'error');
        setIsSaving(true);
        try {
            const updated = sections.map(s => {
                if (s.id !== editingBook.sectionId) return s;
                let updatedBooks: BookItem[];
                if (editingBook.bookId === null) {
                    // Add new book
                    const newBook: BookItem = {
                        id: nextId(s.books || []),
                        title: bookForm.title,
                        language: bookForm.language,
                        fileUrl: bookForm.fileUrl,
                        image: bookForm.image || undefined,
                    };
                    updatedBooks = [...(s.books || []), newBook];
                } else {
                    // Edit existing book
                    updatedBooks = (s.books || []).map(b =>
                        b.id === editingBook.bookId
                            ? { ...b, title: bookForm.title, language: bookForm.language, fileUrl: bookForm.fileUrl, image: bookForm.image || undefined }
                            : b
                    );
                }
                return { ...s, books: updatedBooks };
            });
            await saveBookSections(updated);
            setSections(updated);
            showMessage('Book saved successfully.', 'success');
            setEditingBook(null);
        } catch (error) {
            showMessage('Failed to save book.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteBook = async (sectionId: number, bookId: number) => {
        if (!confirm('Delete this book?')) return;
        try {
            const updated = sections.map(s => {
                if (s.id !== sectionId) return s;
                return { ...s, books: (s.books || []).filter(b => b.id !== bookId) };
            });
            await saveBookSections(updated);
            setSections(updated);
            showMessage('Book deleted.', 'success');
        } catch (error) {
            showMessage('Failed to delete book.', 'error');
        }
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '6px',
        border: '1px solid rgba(255,215,0,0.2)',
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--color-ivory)', fontSize: '1rem', width: '100%',
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
                    <h1>Service Books Manager</h1>
                    <p>Manage book sections and upload liturgical books (PDF). Changes save instantly and are live on the public page.</p>
                </div>
                <Button variant="primary" onClick={addSection}>➕ Add Section</Button>
            </header>

            {sections.map(section => (
                <Card key={section.id} className={styles.tableCard} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,215,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {section.image && (
                                <img src={section.image} alt={section.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
                            )}
                            <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', margin: 0, fontSize: '1.3rem' }}>
                                📚 {section.title} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body-system)' }}>({(section.books || []).length} books)</span>
                            </h2>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button variant="outline" onClick={() => openAddBook(section.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>+ Add Book</Button>
                            <Button variant="outline" onClick={() => editSection(section)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Rename</Button>
                            <Button variant="secondary" onClick={() => deleteSection(section.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</Button>
                        </div>
                    </div>

                    {(section.books || []).length > 0 && (
                        <div className={styles.tableResponsive}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Language</th>
                                        <th>File</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(section.books || []).map(book => (
                                        <tr key={book.id}>
                                            <td style={{ fontWeight: 'bold' }}>{book.title}</td>
                                            <td>{book.language}</td>
                                            <td>
                                                {book.fileUrl
                                                    ? <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#27AE60', fontSize: '0.85rem', textDecoration: 'underline' }}>✅ Open PDF</a>
                                                    : <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No file</span>
                                                }
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <Button variant="outline" onClick={() => openEditBook(section.id, book)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</Button>
                                                    <Button variant="secondary" onClick={() => deleteBook(section.id, book.id)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>🗑️</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {(!section.books || section.books.length === 0) && (
                        <p style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>No books yet. Click &quot;+ Add Book&quot; to upload a PDF.</p>
                    )}
                </Card>
            ))}

            {/* Section Modal */}
            {editingSectionId !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '450px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.5rem' }}>
                            {editingSectionId === 'new' ? 'Add Section' : 'Rename Section'}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} placeholder="Section Title *" style={inputStyle} />

                            <div>
                                <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                                    📸 Section Cover Image (Optional)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {sectionImage
                                        ? <img src={sectionImage} alt="preview" style={{ width: 120, height: 68, borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                                        : <span style={{ width: 120, height: 68, borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🖼️</span>
                                    }
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <button type="button" onClick={() => sectionImgInputRef.current?.click()} disabled={uploading} style={{ ...inputStyle, width: 'auto', cursor: uploading ? 'not-allowed' : 'pointer', padding: '6px 12px', fontSize: '0.85rem' }}>
                                            {uploading ? '⏳ Uploading...' : (sectionImage ? '🔄 Change' : '📷 Upload')}
                                        </button>
                                        {sectionImage && (
                                            <button type="button" onClick={() => setSectionImage('')} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✕ Remove</button>
                                        )}
                                    </div>
                                    <input ref={sectionImgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSectionImageUpload} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setEditingSectionId(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveSection} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Book Modal */}
            {editingBook && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '540px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.5rem' }}>
                            {editingBook.bookId === null ? 'Add Book (PDF)' : 'Edit Book'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} placeholder="Book Title *" style={inputStyle} />
                            <select value={bookForm.language} onChange={e => setBookForm({ ...bookForm, language: e.target.value })} style={inputStyle}>
                                <option value="Malayalam">Malayalam</option>
                                <option value="English">English</option>
                                <option value="Syriac">Syriac</option>
                            </select>

                            <div>
                                <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Upload PDF File</label>
                                <div
                                    onClick={() => !uploading && pdfInputRef.current?.click()}
                                    style={{ border: '2px dashed rgba(255,215,0,0.3)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}
                                >
                                    {uploading ? (
                                        <p style={{ color: 'var(--text-accent)' }}>⏳ Uploading to Server...</p>
                                    ) : bookForm.fileName ? (
                                        <p style={{ color: '#27AE60', margin: 0 }}>✅ {bookForm.fileName}</p>
                                    ) : bookForm.fileUrl ? (
                                        <p style={{ color: '#27AE60', margin: 0 }}>✅ File URL Set</p>
                                    ) : (
                                        <>
                                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>📄 Click to upload a PDF</p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>or enter a URL below</p>
                                        </>
                                    )}
                                </div>
                                <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            </div>

                            <input value={bookForm.fileUrl} onChange={e => setBookForm({ ...bookForm, fileUrl: e.target.value, fileName: '' })} placeholder="Paste a file URL (Google Drive, etc.)" style={inputStyle} />

                            <div>
                                <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                                    📸 Book Cover / Thumbnail (1:1)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {bookForm.image
                                        ? <img src={bookForm.image} alt="preview" style={{ width: 60, height: 60, borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                                        : <span style={{ width: 60, height: 60, borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>📖</span>
                                    }
                                    <button type="button" onClick={() => imgInputRef.current?.click()} disabled={uploading} style={{ ...inputStyle, width: 'auto', cursor: uploading ? 'not-allowed' : 'pointer', padding: '8px 14px' }}>
                                        {uploading ? '⏳ Uploading...' : (bookForm.image ? '🔄 Change Image' : '📷 Upload Image')}
                                    </button>
                                    {bookForm.image && <button type="button" onClick={() => setBookForm(p => ({ ...p, image: '' }))} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Remove</button>}
                                    <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBookImageUpload} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setEditingBook(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveBook} disabled={isSaving || uploading}>{isSaving ? 'Saving...' : 'Save Book'}</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
