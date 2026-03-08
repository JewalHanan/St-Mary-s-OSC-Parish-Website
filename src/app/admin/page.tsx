'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { getSliderImages, getEvents, getPrayerRequests, getBookSections } from '@/lib/store';
import styles from '@/styles/AdminDashboard.module.css';

export default function AdminDashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        sliderImages: 0,
        events: 0,
        prayerRequests: 0,
        pendingRequests: 0,
        bookSections: 0,
        totalBooks: 0,
    });

    useEffect(() => {
        const update = () => {
            const images = getSliderImages();
            const events = getEvents();
            const requests = getPrayerRequests();
            const sections = getBookSections();
            setStats({
                sliderImages: images.length,
                events: events.length,
                prayerRequests: requests.length,
                pendingRequests: requests.filter(r => r.status === 'PENDING').length,
                bookSections: sections.length,
                totalBooks: sections.reduce((acc, s) => acc + s.books.length, 0),
            });
        };
        update();
        window.addEventListener('storage', update);
        return () => window.removeEventListener('storage', update);
    }, []);

    const cards = [
        { label: 'Slider Images', value: stats.sliderImages, icon: '🖼️', color: '#F5A623' },
        { label: 'Events', value: stats.events, icon: '📅', color: '#1E90FF' },
        { label: 'Total Requests', value: stats.prayerRequests, icon: '🙏', color: '#9B59B6' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: '⏳', color: '#E74C3C' },
        { label: 'Book Sections', value: stats.bookSections, icon: '📚', color: '#27AE60' },
        { label: 'Total Books', value: stats.totalBooks, icon: '📖', color: '#F39C12' },
    ];

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1>Dashboard</h1>
                <p>Welcome back, {session?.user?.name || 'Admin'}. Here's an overview of your website.</p>
            </div>

            <div className={styles.statsGrid}>
                {cards.map((card, idx) => (
                    <Card key={idx} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{card.value}</span>
                            <span className={styles.statLabel}>{card.label}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                    <a href="/admin/slider" className={styles.actionLink}>🖼️ Manage Slider</a>
                    <a href="/admin/events" className={styles.actionLink}>📅 Manage Events</a>
                    <a href="/admin/prayer-requests" className={styles.actionLink}>🙏 View Requests</a>
                    <a href="/admin/books" className={styles.actionLink}>📚 Manage Books</a>
                </div>
            </Card>
        </div>
    );
}
