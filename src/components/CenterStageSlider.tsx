'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getEventBanners, type EventBannerImage } from '@/lib/store';
import styles from '@/styles/CenterStageSlider.module.css';

interface CenterStageSliderProps {
    autoPlayMs?: number;
    logoSrc?: string;
}

export default function CenterStageSlider({
    autoPlayMs = 5000,
    logoSrc = '/images/logo.png',
}: CenterStageSliderProps) {
    const [slides, setSlides] = useState<EventBannerImage[]>([]);
    const [current, setCurrent] = useState(0);
    const dragStartX = useRef(0);
    const dragDelta = useRef(0);
    const dragging = useRef(false);
    const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Load + live-sync from store ───────────────────────────────
    useEffect(() => {
        const load = () => setSlides(getEventBanners());
        load();
        window.addEventListener('stmosc-store-update', load);
        window.addEventListener('storage', load);
        return () => {
            window.removeEventListener('stmosc-store-update', load);
            window.removeEventListener('storage', load);
        };
    }, []);

    // ── Auto-play ─────────────────────────────────────────────────
    const startAuto = useCallback(() => {
        if (autoTimer.current) clearInterval(autoTimer.current);
        if (!autoPlayMs || slides.length < 2) return;
        autoTimer.current = setInterval(
            () => setCurrent(p => (p + 1) % slides.length),
            autoPlayMs,
        );
    }, [autoPlayMs, slides.length]);

    useEffect(() => {
        startAuto();
        return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
    }, [startAuto]);

    const goTo = (idx: number) => {
        setCurrent((idx + slides.length) % slides.length);
        startAuto();
    };

    // ── Pointer drag / swipe ──────────────────────────────────────
    const onPointerDown = (e: React.PointerEvent) => {
        dragging.current = true;
        dragStartX.current = e.clientX;
        dragDelta.current = 0;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        dragDelta.current = e.clientX - dragStartX.current;
    };
    const onPointerUp = () => {
        if (!dragging.current) return;
        dragging.current = false;
        if (dragDelta.current < -50) goTo(current + 1);
        else if (dragDelta.current > 50) goTo(current - 1);
    };

    // ── Per-slide CSS class based on distance from center ─────────
    const slideClass = (idx: number): string => {
        if (slides.length === 0) return styles.hidden;
        const n = slides.length;
        // Signed offset, shortest-path through the circular array
        let d = idx - current;
        // Wrap to the range [-n/2, n/2]
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;

        if (d === 0) return styles.active;
        if (d === -1) return styles.neighborLeft;
        if (d === 1) return styles.neighborRight;
        if (d === -2) return styles.farLeft;
        if (d === 2) return styles.farRight;
        return styles.hidden;
    };

    if (slides.length === 0) return null;

    return (
        <div
            className={styles.sliderWrapper}
            style={{ touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
        >
            {/* Stage: all slides absolutely positioned here */}
            <div className={styles.stage}>
                {/* Invisible spacer to give the stage its height (matches center slide) */}
                <div className={styles.stageSpacer} aria-hidden="true" />

                {slides.map((slide, idx) => {
                    const cls = slideClass(idx);
                    const isActive = cls === styles.active;
                    return (
                        <div
                            key={slide.id}
                            className={`${styles.slide} ${cls}`}
                            onClick={() => !isActive && goTo(idx)}
                            aria-hidden={!isActive}
                        >
                            <div className={styles.imageBox}>
                                <img
                                    src={slide.image}
                                    alt={slide.caption || `Slide ${idx + 1}`}
                                    className={styles.image}
                                    draggable={false}
                                />
                                {/* Caption gradient — CSS shows only for .active */}
                                {slide.caption && (
                                    <p className={styles.caption}>{slide.caption}</p>
                                )}
                                {/* Church logo badge — fades in on active slide */}
                                {logoSrc && (
                                    <div className={styles.logoOverlay} aria-hidden="true">
                                        <img src={logoSrc} alt="Logo" className={styles.logoImg} draggable={false} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Prev / Next arrows — outside the stage so they sit above it ── */}
            <button
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={() => goTo(current - 1)}
                aria-label="Previous slide"
            >‹</button>
            <button
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={() => goTo(current + 1)}
                aria-label="Next slide"
            >›</button>

            {/* ── Dot indicators ── */}
            <div className={styles.dots} role="tablist">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`${styles.dot} ${idx === current ? styles.activeDot : ''}`}
                        onClick={() => goTo(idx)}
                        role="tab"
                        aria-selected={idx === current}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
