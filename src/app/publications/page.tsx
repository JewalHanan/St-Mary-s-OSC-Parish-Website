'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getPublications, type Publication } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';
import styles from '@/styles/Publications.module.css';

function openPdf(pub: Publication) {
    const url = pub.fileUrl;
    if (!url) { alert('No file uploaded for this publication yet.'); return; }

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
                a.download = `${pub.name}.pdf`;
                a.click();
            }
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    } catch (err) {
        console.error('Failed to open PDF:', err);
        alert('Sorry, there was an issue opening this PDF.');
    }
}

export default function PublicationsPage() {
    const { data: publications } = useStoreData(getPublications, [] as Publication[]);
    const safePublications = Array.isArray(publications) ? publications : [];

    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Publications
                </motion.h1>
                <p className={styles.subtitle}>Parish newsletters, circulars & supplement papers.</p>
            </div>

            <div className={styles.cardsGrid}>
                {safePublications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📄</span>
                        <h2 className={styles.emptyTitle}>No publications yet</h2>
                        <p>Publications will appear here once the admin uploads them.</p>
                    </div>
                ) : (
                    safePublications.map((pub, idx) => (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: idx * 0.08 }}
                        >
                            <Card className={styles.pubCard} withGlow>
                                <div className={styles.cardIconBar}>
                                    <span className={styles.fileIcon}>📄</span>
                                    <h2 className={styles.cardName}>{pub.name}</h2>
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardDescription}>{pub.description}</p>
                                    <Button
                                        variant="primary"
                                        className={styles.openBtn}
                                        onClick={() => openPdf(pub)}
                                    >
                                        📖 Open PDF
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
