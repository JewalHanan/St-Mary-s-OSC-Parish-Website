'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styles from '@/styles/AdminLayout.module.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile navigation)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            document.body.style.overflow = sidebarOpen ? 'hidden' : '';
            return () => { document.body.style.overflow = ''; };
        }
    }, [sidebarOpen]);

    const navLinks = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/slider', label: 'Homepage Slider', icon: '🖼️' },
        { href: '/admin/event-banners', label: 'Event Banner Images', icon: '🎬' },
        { href: '/admin/prayer-requests', label: 'Prayer Requests', icon: '🙏' },
        { href: '/admin/events', label: 'Events List', icon: '📅' },
        { href: '/admin/calendar', label: 'Calendar Special Days', icon: '✨' },
        { href: '/admin/parish', label: 'Parish Members', icon: '👥' },
        { href: '/admin/ministries', label: 'Ministries', icon: '🏛️' },
        { href: '/admin/books', label: 'Service Books', icon: '📚' },
    ];

    const userRole = (session?.user as any)?.role;
    if (userRole === 'SUPER_ADMIN') {
        navLinks.push({ href: '/admin/audit', label: 'Audit Logs', icon: '📋' });
    }

    return (
        <div className={styles.adminWrapper}>
            {/* Mobile hamburger toggle */}
            <button
                className={styles.mobileToggle}
                onClick={() => setSidebarOpen(prev => !prev)}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={sidebarOpen}
            >
                <div className={`${styles.hamburger} ${sidebarOpen ? styles.hamburgerOpen : ''}`}>
                    <span /><span /><span />
                </div>
            </button>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarVisible : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Panel</h2>
                    <p className={styles.userRoleBadge}>{session?.user?.role}</p>
                </div>

                <nav className={styles.sidebarNav}>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
                                <span className={styles.icon}>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.logoutBtn} style={{ marginBottom: '10px' }}>
                        <span className={styles.icon}>🏠</span> Public Site
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
                        <span className={styles.icon}>🚪</span> Logout
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
