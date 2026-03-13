'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBookSections, saveBookSections, nextId, type BookSection, type BookItem } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

export default function BooksManager() {
    const [sections, setSections] = useState<BookSection[]>([]);
    const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
    const [sectionTitle, setSectionTitle] = useState('');
    const [sectionImage, setSectionImage] = useState('');
    const [editingBook, setEditingBook] = useState<{ sectionId: number; bookId: number | null } | null>(null);
    const [bookForm, setBookForm] = useState({ title: '', language: 'Malayalam', fileUrl: '', fileName: '', image: '' });
    const [uploading, setUploading] = useState(false);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const imgInputRef = useRef<HTMLInputElement>(null);
    const sectionImgInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { getBookSections().then(setSections); }, []);

    const persist = async (updated: BookSection[]) => {
        setSections(updated);
        await saveBookSections(updated);
    };

    // ── Section Image Upload (original quality) ──
    const handleSectionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setSectionImage(reader.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // ── Section CRUD ──
    const addSection = () => { setEditingSectionId(0); setSectionTitle(''); setSectionImage(''); };
    const editSection = (s: BookSection) => { setEditingSectionId(s.id); setSectionTitle(s.title); setSectionImage(s.image || ''); };
    const saveSection = () => {
        if (!sectionTitle) return alert('Title is required.');
        if (editingSectionId === 0) {
            persist([...sections, { id: nextId(sections), title: sectionTitle, image: sectionImage || undefined, books: [] }]);
        } else {
            persist(sections.map(s => s.id === editingSectionId ? { ...s, title: sectionTitle, image: sectionImage || undefined } : s));
        }
        setEditingSectionId(null);
    };
    const deleteSection = (id: number) => {
        if (confirm('Delete this section and all its books?')) persist(sections.filter(s => s.id !== id));
    };

    // ── PDF file upload (local: converts to data URL for demo; in production use S3/Cloudinary) ──
    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') return alert('Please select a PDF file.');
        setUploading(true);
        const reader = new FileReader();
        reader.onload = () => {
            setBookForm(prev => ({
                ...prev,
                fileUrl: reader.result as string,
                fileName: file.name,
            }));
            setUploading(false);
        };
        reader.readAsDataURL(file);
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

    // Book thumbnail upload (original quality)
    const handleBookImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setBookForm(prev => ({ ...prev, image: reader.result as string }));
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    const saveBook = () => {
        if (!bookForm.title || !editingBook) return alert('Book title is required.');
        persist(sections.map(s => {
            if (s.id !== editingBook.sectionId) return s;
            const newBook = { title: bookForm.title, language: bookForm.language, fileUrl: bookForm.fileUrl || '#', image: bookForm.image || undefined };
            if (editingBook.bookId === null) {
                const allIds = s.books.map(b => b.id);
                const newId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
                return { ...s, books: [...s.books, { id: newId, ...newBook }] };
            }
            return { ...s, books: s.books.map(b => b.id === editingBook.bookId ? { ...b, ...newBook } : b) };
        }));
        setEditingBook(null);
    };
    const deleteBook = (sectionId: number, bookId: number) => {
        if (confirm('Delete this book?')) {
            persist(sections.map(s => s.id === sectionId ? { ...s, books: s.books.filter(b => b.id !== bookId) } : s));
        }
    };

    // download a stored book
    const downloadBook = (book: BookItem) => {
        if (!book.fileUrl || book.fileUrl === '#') return alert('No file uploaded for this book yet.');
        const link = document.createElement('a');
        link.href = book.fileUrl;
        link.download = `${book.title}.pdf`;
        link.click();
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
                    <h1>Service Books Manager</h1>
                    <p>Manage book sections and upload liturgical books (PDF). Changes are live on the public page.</p>
                </div>
                <Button variant="primary" onClick={addSection}>➕ Add Section</Button>
            </header>

            {sections.map(section => (
                <Card key={section.id} className={styles.tableCard} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,215,0,0.1)' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', margin: 0, fontSize: '1.3rem' }}>
                            📚 {section.title} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body-system)' }}>({section.books.length} books)</span>
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button variant="outline" onClick={() => openAddBook(section.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>+ Add Book</Button>
                            <Button variant="outline" onClick={() => editSection(section)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Rename</Button>
                            <Button variant="secondary" onClick={() => deleteSection(section.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</Button>
                        </div>
                    </div>

                    {section.books.length > 0 && (
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
                                    {section.books.map(book => (
                                        <tr key={book.id}>
                                            <td style={{ fontWeight: 'bold' }}>{book.title}</td>
                                            <td>{book.language}</td>
                                            <td>
                                                {book.fileUrl && book.fileUrl !== '#'
                                                    ? <span style={{ color: '#27AE60', fontSize: '0.85rem' }}>✅ PDF Ready</span>
                                                    : <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No file</span>
                                                }
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <Button variant="outline" onClick={() => downloadBook(book)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>📥</Button>
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
                    {section.books.length === 0 && (
                        <p style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>No books yet. Click "+ Add Book" to upload a PDF.</p>
                    )}
                </Card>
            ))}

            {/* Section Modal */}
            {editingSectionId !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '450px', background: 'var(--color-navy)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.5rem' }}>
                            {editingSectionId === 0 ? 'Add Section' : 'Rename Section'}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                value={sectionTitle}
                                onChange={e => setSectionTitle(e.target.value)}
                                placeholder="Section Title *"
                                style={inputStyle}
                            />

                            <div>
                                <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                                    📸 Section Cover Image (Optional, Landscape)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {sectionImage
                                        ? <img src={sectionImage} alt="preview" style={{ width: 120, height: 68, borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                                        : <span style={{ width: 120, height: 68, borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🖼️</span>
                                    }
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <button type="button" onClick={() => sectionImgInputRef.current?.click()} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '6px 12px', fontSize: '0.85rem' }}>
                                            {sectionImage ? '🔄 Change' : '📷 Upload'}
                                        </button>
                                        {sectionImage && (
                                            <button type="button" onClick={() => setSectionImage('')} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>
                                    <input ref={sectionImgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSectionImageUpload} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setEditingSectionId(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveSection}>Save</Button>
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

                            {/* PDF Upload */}
                            <div>
                                <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Upload PDF File</label>
                                <div
                                    onClick={() => pdfInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed rgba(255,215,0,0.3)', borderRadius: '8px',
                                        padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s',
                                    }}
                                >
                                    {uploading ? (
                                        <p style={{ color: 'var(--text-accent)' }}>⏳ Loading PDF...</p>
                                    ) : bookForm.fileName ? (
                                        <p style={{ color: '#27AE60', margin: 0 }}>✅ {bookForm.fileName}</p>
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

                            <input
                                value={bookForm.fileUrl.startsWith('data:') ? '' : bookForm.fileUrl}
                                onChange={e => setBookForm({ ...bookForm, fileUrl: e.target.value, fileName: '' })}
                                placeholder="Paste a file URL (Google Drive, etc.)"
                                style={inputStyle}
                            />

                            {/* Square thumbnail image upload (1:1) */}
                            <div>
                                <label style={{ color: 'var(--color-ivory)', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                                    📸 Book Cover / Thumbnail (optional, 1:1)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {bookForm.image
                                        ? <img src={bookForm.image} alt="preview" style={{ width: 60, height: 60, borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                                        : <span style={{ width: 60, height: 60, borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>📖</span>
                                    }
                                    <button type="button" onClick={() => imgInputRef.current?.click()} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '8px 14px' }}>
                                        {bookForm.image ? '🔄 Change Image' : '📷 Upload Image'}
                                    </button>
                                    {bookForm.image && <button type="button" onClick={() => setBookForm(p => ({ ...p, image: '' }))} style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Remove</button>}
                                    <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBookImageUpload} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setEditingBook(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveBook}>Save Book</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
