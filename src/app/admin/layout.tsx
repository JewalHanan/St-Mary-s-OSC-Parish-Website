'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styles from '@/styles/AdminLayout.module.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navLinks = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/slider', label: 'Homepage Slider', icon: '🖼️' },
        { href: '/admin/event-banners', label: 'Event Banner Images', icon: '🎬' },
        { href: '/admin/prayer-requests', label: 'Prayer Requests', icon: '🙏' },
        { href: '/admin/events', label: 'Events List', icon: '📅' },
        { href: '/admin/calendar', label: 'Calendar Special Days', icon: '✨' },
        { href: '/admin/parish', label: 'Parish Members', icon: '👥' },
        { href: '/admin/organisations', label: 'Organisations', icon: '🏛️' },
        { href: '/admin/books', label: 'Service Books', icon: '📚' },
    ];

    const userRole = (session?.user as any)?.role;
    if (userRole === 'SUPER_ADMIN') {
        navLinks.push({ href: '/admin/audit', label: 'Audit Logs', icon: '📋' });
    }

    return (
        <div className={styles.adminWrapper}>
            <aside className={styles.sidebar}>
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
