'use client';

import { usePathname } from 'next/navigation';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
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

    return <AnimeNavBar items={navItems} defaultActive={activeTab} />;
}

