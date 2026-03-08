'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBookSections, type BookSection } from '@/lib/store';
import styles from '@/styles/Books.module.css';

export default function BooksPage() {
    const [sections, setSections] = useState<BookSection[]>([]);
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const handleOpen = (book: any) => {
        // The store uses camelCase `fileUrl` — fall back to snake_case just in case
        const url: string = book.fileUrl || book.file_url || '';

        if (!url || url === '#') {
            alert('No file has been uploaded for this book yet.');
            return;
        }

        try {
            if (url.startsWith('data:')) {
                // Base64 PDF → convert to Blob → open in new tab so the browser renders it inline
                const [header, base64] = url.split(',');
                const mime = header.match(/:(.*?);/)?.[1] ?? 'application/pdf';
                const byteStr = atob(base64);
                const bytes = new Uint8Array(byteStr.length);
                for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
                const blob = new Blob([bytes], { type: mime });
                const blobUrl = URL.createObjectURL(blob);

                // Open inline in a new tab (readable in browser PDF viewer)
                const win = window.open(blobUrl, '_blank');
                if (!win) {
                    // Pop-up blocked → fall back to download
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = `${book.title}.pdf`;
                    a.click();
                }
                // Clean up after a short delay
                setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
            } else {
                // External URL — open directly in new tab
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } catch (err) {
            console.error('Failed to open book:', err);
            alert('Sorry, there was an issue opening this book. Please try again.');
        }
    };

    useEffect(() => {
        setSections(getBookSections());
        const handler = () => setSections(getBookSections());
        window.addEventListener('stmosc-store-update', handler);
        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('stmosc-store-update', handler);
            window.removeEventListener('storage', handler);
        };
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Service Books Library
                </motion.h1>
                <p className={styles.subtitle}>Digital library of Malankara Orthodox liturgical books.</p>
            </div>

            <div className={styles.sectionsGrid}>
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                        <Card
                            className={`${styles.sectionCard} ${expandedSection === section.id ? styles.expanded : ''}`}
                            withGlow
                        >
                            <div
                                className={styles.sectionHeader}
                                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            >
                                <div className={styles.sectionIcon}>📚</div>
                                <h2>{section.title}</h2>
                                <span className={styles.bookCount}>{section.books.length} book{section.books.length !== 1 ? 's' : ''}</span>
                                <span className={styles.expandArrow}>
                                    {expandedSection === section.id ? '▲' : '▼'}
                                </span>
                            </div>

                            {expandedSection === section.id && (
                                <motion.div
                                    className={styles.booksList}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {section.books.map((book) => (
                                        <div key={book.id} className={styles.bookItem}>
                                            {/* Thumbnail: uploaded image or default icon */}
                                            {book.image
                                                ? <img src={book.image} alt={book.title} style={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--card-border)' }} />
                                                : <span style={{ width: 48, height: 48, borderRadius: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>📖</span>
                                            }
                                            <div className={styles.bookInfo}>
                                                <span className={styles.bookTitle}>{book.title}</span>
                                                <span className={styles.bookLang}>{book.language}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                style={{ padding: '6px 14px', fontSize: '0.85rem', flexShrink: 0 }}
                                                onClick={() => handleOpen(book)}
                                            >
                                                📖 Open / Read
                                            </Button>
                                        </div>
                                    ))}
                                    {section.books.length === 0 && (
                                        <p className={styles.emptyBooks}>No books uploaded yet for this section.</p>
                                    )}
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
