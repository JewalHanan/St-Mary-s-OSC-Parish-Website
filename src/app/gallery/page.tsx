'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { getGallerySections, type GallerySection, type GalleryImage } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';
import styles from '@/styles/Gallery.module.css';

export default function GalleryPage() {
    const { data: sections, loading } = useStoreData(getGallerySections, [] as GallerySection[]);
    const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; index: number } | null>(null);

    const openLightbox = (images: GalleryImage[], index: number) => setLightbox({ images, index });
    const closeLightbox = () => setLightbox(null);

    const moveLightbox = useCallback((dir: -1 | 1) => {
        setLightbox(prev => {
            if (!prev) return prev;
            const next = prev.index + dir;
            if (next < 0 || next >= prev.images.length) return prev;
            return { ...prev, index: next };
        });
    }, []);

    // Keyboard navigation
    useEffect(() => {
        if (!lightbox) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') moveLightbox(-1);
            if (e.key === 'ArrowRight') moveLightbox(1);
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox, moveLightbox]);

    const [isMobile, setIsMobile] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSection = (id: string | number) => {
        if (!isMobile) return;
        const key = String(id);
        setExpandedSections(prev => ({
            ...prev,
            [key]: prev[key] === undefined ? false : !prev[key]
        }));
    };

    const safeSections = (Array.isArray(sections) ? sections : []).filter(s => s && typeof s === 'object');
    const noImages = safeSections.every(s => !s.images || !Array.isArray(s.images) || s.images.length === 0) || safeSections.length === 0;

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            <p>Loading...</p>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Parish Gallery
                </motion.h1>
                <p className={styles.subtitle}>Cherished moments from our parish community.</p>
            </div>

            {noImages ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📸</span>
                    <h2 className={styles.emptyTitle}>No photos yet</h2>
                    <p>Gallery photos will appear here once the admin uploads them.</p>
                </div>
            ) : (
                <div className={styles.sectionsWrapper}>
                    {safeSections.filter(s => Array.isArray(s.images) && s.images.length > 0).map((section, idx) => {
                        const isExpanded = !isMobile || (expandedSections[section.id] ?? idx === 0);

                        return (
                            <motion.div
                                key={section.id}
                                className={styles.sectionBlock}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div 
                                    className={`${styles.sectionHeader} ${isMobile ? styles.sectionHeaderMobile : ''}`}
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <h2 className={styles.sectionTitle}>{section.name}</h2>
                                    <span className={styles.sectionCount}>{section.images.length} photo{section.images.length !== 1 ? 's' : ''}</span>
                                    <div className={styles.divider} />
                                    {isMobile && (
                                        <motion.div 
                                            animate={{ rotate: isExpanded ? 180 : 0 }} 
                                            className={styles.chevron}
                                            transition={{ duration: 0.3 }}
                                        >
                                            ▼
                                        </motion.div>
                                    )}
                                </div>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            key="content"
                                            initial={isMobile ? { height: 0, opacity: 0 } : false}
                                            animate={isMobile ? { height: 'auto', opacity: 1 } : { opacity: 1 }}
                                            exit={isMobile ? { height: 0, opacity: 0 } : undefined}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div className={`${styles.imageGrid} ${isMobile ? styles.imageGridMobilePadding : ''}`}>
                                                {section.images.filter(img => img && typeof img === 'object').map((img, imgIdx) => (
                                                    <motion.div
                                                        key={img?.id || imgIdx}
                                                        className={styles.gridItem}
                                                        onClick={() => openLightbox(section.images.filter(img => img && typeof img === 'object'), imgIdx)}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: imgIdx * 0.04 }}
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={img.url}
                                                            alt={img.caption || `Photo ${imgIdx + 1}`}
                                                            className={styles.gridImage}
                                                            loading="lazy"
                                                        />
                                                        <div className={styles.gridOverlay}>
                                                            {img.caption && (
                                                                <span className={styles.gridCaption}>{img.caption}</span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        className={styles.lightboxBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLightbox}
                    >
                        {/* Prev */}
                        <button
                            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                            onClick={e => { e.stopPropagation(); moveLightbox(-1); }}
                            disabled={lightbox.index === 0}
                            aria-label="Previous image"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >‹</button>

                        {/* Image */}
                        <motion.div
                            className={styles.lightboxContent}
                            onClick={e => e.stopPropagation()}
                            key={lightbox.index}
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={lightbox.images[lightbox.index].url}
                                alt={lightbox.images[lightbox.index].caption || 'Gallery image'}
                                className={styles.lightboxImage}
                            />
                            {lightbox.images[lightbox.index].caption && (
                                <p className={styles.lightboxCaption}>{lightbox.images[lightbox.index].caption}</p>
                            )}
                            <span className={styles.lightboxCounter}>
                                {lightbox.index + 1} / {lightbox.images.length}
                            </span>
                        </motion.div>

                        {/* Close */}
                        <button
                            className={styles.lightboxClose}
                            onClick={closeLightbox}
                            aria-label="Close lightbox"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >✕</button>

                        {/* Next */}
                        <button
                            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                            onClick={e => { e.stopPropagation(); moveLightbox(1); }}
                            disabled={lightbox.index === lightbox.images.length - 1}
                            aria-label="Next image"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >›</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
