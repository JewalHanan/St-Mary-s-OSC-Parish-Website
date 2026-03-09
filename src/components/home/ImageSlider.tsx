'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSliderImages, type SliderImage } from '@/lib/store';
import styles from '@/styles/ImageSlider.module.css';

export default function ImageSlider() {
    const [slides, setSlides] = useState<SliderImage[]>([]);
    const [current, setCurrent] = useState(0);
    const dragStartX = useRef(0);
    const dragDelta = useRef(0);
    const dragging = useRef(false);
    const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load from API
    useEffect(() => {
        getSliderImages().then(setSlides);
    }, []);

    // Auto-play
    const startAuto = useCallback(() => {
        if (autoTimer.current) clearInterval(autoTimer.current);
        if (slides.length < 2) return;
        autoTimer.current = setInterval(
            () => setCurrent(p => (p + 1) % slides.length),
            6000,
        );
    }, [slides.length]);

    useEffect(() => {
        startAuto();
        return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
    }, [startAuto]);

    const goTo = (idx: number) => {
        setCurrent((idx + slides.length) % slides.length);
        startAuto();
    };

    // Pointer drag
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

    // Same 4-state distance system as CenterStageSlider
    const slideClass = (idx: number): string => {
        const n = slides.length;
        let d = idx - current;
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
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ touchAction: 'none' }}
        >
            <div className={styles.stage}>
                {/* Invisible spacer drives stage height */}
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
                                    alt={slide.title || `Slide ${idx + 1}`}
                                    className={styles.image}
                                    draggable={false}
                                />
                                {/* Caption + title gradient overlay */}
                                {(slide.title || slide.caption) && (
                                    <div className={styles.captionArea}>
                                        {slide.title && <h3 className={styles.slideTitle}>{slide.title}</h3>}
                                        {slide.caption && <p className={styles.slideCaption}>{slide.caption}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Arrows */}
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => goTo(current - 1)} aria-label="Previous">‹</button>
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={() => goTo(current + 1)} aria-label="Next">›</button>

            {/* Dots */}
            <div className={styles.dots}>
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`${styles.dot} ${idx === current ? styles.activeDot : ''}`}
                        onClick={() => goTo(idx)}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
