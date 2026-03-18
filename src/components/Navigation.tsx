'use client';

import { usePathname } from 'next/navigation';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import {
    Home,
    BookOpen,
    HandHeart,
    CalendarDays,
    Church,
    Users,
    Mail,
    Images,
    FileText,
} from 'lucide-react';

const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Books', url: '/books', icon: BookOpen },
    { name: 'Gallery', url: '/gallery', icon: Images },
    { name: 'Publications', url: '/publications', icon: FileText },
    { name: 'Prayer', url: '/prayer-requests', icon: HandHeart },
    { name: 'Calendar', url: '/calendar', icon: CalendarDays },
    { name: 'Parish', url: '/parish', icon: Church },
    { name: 'Ministries', url: '/ministries', icon: Users },
    { name: 'Contact', url: '/contact', icon: Mail },
];

export default function Navigation() {
    const pathname = usePathname();

    // Hide global navigation on admin pages
    if (pathname?.startsWith('/admin')) return null;

    // Determine active tab from current route
    const activeTab = navItems.find(item =>
        item.url === '/' ? pathname === '/' : pathname?.startsWith(item.url)
    )?.name || 'Home';

    const { toggleLanguage, isEnglish } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            {/* Language + Theme toggle bar fixed top right */}
            <div style={{
                position: 'fixed',
                top: '12px',
                right: '16px',
                zIndex: 9999,
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
            }}>

                {/* Language Toggle Button */}
                <button
                    onClick={toggleLanguage}
                    title={isEnglish ? 'Switch to Malayalam' : 'Switch to English'}
                    style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '5px 14px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        fontFamily: isEnglish
                            ? 'var(--font-poppins), Poppins, sans-serif'
                            : "'FKL-Dhikk', 'Noto Sans Malayalam', serif",
                    }}
                >
                    {isEnglish ? '🇮🇳 മലയാളം' : '🌐 English'}
                </button>

                {/* Dark / Light Mode Toggle Button */}
                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

            </div>

            <AnimeNavBar items={navItems} defaultActive={activeTab} />
        </>
    );
}

