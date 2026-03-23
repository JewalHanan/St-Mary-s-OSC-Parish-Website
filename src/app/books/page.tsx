'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getBookSections, type BookSection, type BookItem } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';
import styles from '@/styles/Books.module.css';

export default function BooksPage() {
    const { data: sections, loading } = useStoreData(getBookSections, [] as BookSection[]);
    const safeSections = Array.isArray(sections) ? sections : [];

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            <p>Loading...</p>
        </div>
    );

    const handleOpen = (book: BookItem) => {
        const url: string = book.fileUrl || '';

        if (!url || url === '#') {
            alert('No file has been uploaded for this book yet.');
            return;
        }

        try {
            if (url.startsWith('data:')) {
                const [header, base64] = url.split(',');
                const mime = header.match(/:(.*?);/)?.[1] ?? 'application/pdf';
                const byteStr = atob(base64);
                const bytes = new Uint8Array(byteStr.length);
                for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
                const blob = new Blob([bytes], { type: mime });
                const blobUrl = URL.createObjectURL(blob);

                const win = window.open(blobUrl, '_blank');
                if (!win) {
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = `${book.title}.pdf`;
                    a.click();
                }
                setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
            } else {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } catch (err) {
            console.error('Failed to open book:', err);
            alert('Sorry, there was an issue opening this book. Please try again.');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <ScrollReveal>
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
            </ScrollReveal>

            <div className={styles.sectionsGrid}>
                {safeSections.map((section, idx) => (
                    <ScrollReveal key={section.id} delay={0.05 * idx}>
                        <Card className={styles.sectionCard} withGlow glowSpread={40} glowBorderWidth={2}>
                            <div className={styles.sectionImageContainer}>
                                {section.image ? (
                                    <img src={section.image} alt={section.title} className={styles.sectionImage} />
                                ) : (
                                    <span className={styles.sectionPlaceholder}>📚</span>
                                )}
                            </div>

                            <div className={styles.sectionHeader}>
                                <h2>{section.title}</h2>
                                <span className={styles.bookCount}>{section.books?.length || 0} book{(section.books?.length || 0) !== 1 ? 's' : ''}</span>
                            </div>

                            <div className={styles.booksList}>
                                {(section.books || []).map((book) => (
                                    <div key={book.id} className={styles.bookItem}>
                                        <div className={styles.bookThumbAndInfo}>
                                            {book.image ? (
                                                <img src={book.image} alt={book.title} style={{ width: 44, height: 44, borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--card-border)' }} />
                                            ) : (
                                                <span style={{ width: 44, height: 44, borderRadius: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📖</span>
                                            )}
                                            <div className={styles.bookInfo}>
                                                <span className={styles.bookTitle}>{book.title}</span>
                                                <span className={styles.bookLang}>{book.language}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="primary"
                                            className={styles.openBookBtn}
                                            onClick={() => handleOpen(book)}
                                        >
                                            📖 Open Book
                                        </Button>
                                    </div>
                                ))}
                                {(!section.books || section.books.length === 0) && (
                                    <p className={styles.emptyBooks}>No books uploaded yet for this section.</p>
                                )}
                            </div>
                        </Card>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}
