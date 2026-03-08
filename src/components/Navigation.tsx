'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/Navigation.module.css';

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close drawer on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

    // Hide global navigation on admin pages
    if (pathname?.startsWith('/admin')) return null;

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Books', href: '/books' },
        { name: 'Prayer', href: '/prayer-requests' },
        { name: 'Calendar', href: '/calendar' },
        { name: 'Parish', href: '/parish' },
        { name: 'Organisations', href: '/organisations' },
        { name: 'Contact', href: '/contact' },
    ];

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname?.startsWith(href);

    return (
        <>
            <nav
                className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className={styles.container}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo} aria-label="St. Mary's Church Home">
                        <img src="/images/logo.png" alt="" className={styles.logoImage} aria-hidden="true" />
                        <span className={styles.logoText}>St. Mary's</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={styles.desktopNav}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className={styles.controls}>
                        <button
                            onClick={toggleTheme}
                            className={styles.iconButton}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <Link href="/admin/login" className={styles.iconButton} aria-label="Admin panel">
                            ⚙️
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className={styles.mobileToggle}
                            onClick={() => setMobileMenuOpen(prev => !prev)}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-drawer"
                        >
                            <div className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`}>
                                <span />
                                <span />
                                <span />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className={styles.drawerOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={closeMenu}
                            aria-hidden="true"
                        />
                        {/* Drawer */}
                        <motion.div
                            id="mobile-drawer"
                            className={styles.mobileDrawer}
                            role="dialog"
                            aria-label="Mobile navigation"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                        >
                            <nav className={styles.mobileNavLinks}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ''}`}
                                        onClick={closeMenu}
                                        aria-current={isActive(link.href) ? 'page' : undefined}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
