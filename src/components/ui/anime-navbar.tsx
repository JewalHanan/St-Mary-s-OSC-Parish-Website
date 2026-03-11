"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LucideIcon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
    defaultActive?: string
}

export function AnimeNavBar({ items, className, defaultActive = "Home" }: NavBarProps) {
    const [mounted, setMounted] = useState(false)
    const [hoveredTab, setHoveredTab] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>(defaultActive)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = isMobileOpen ? 'hidden' : '';
        }
    }, [isMobileOpen]);

    if (!mounted) return null

    return (
        <div className="anime-navbar-wrapper">
            {/* Desktop Navbar (Hidden on mobile via CSS) */}
            <div className="anime-navbar-center desktop-nav">
                <motion.div
                    className={cn("anime-navbar-pill", className)}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.name
                        const isHovered = hoveredTab === item.name
                        return (
                            <Link
                                key={item.name}
                                href={item.url}
                                onClick={() => setActiveTab(item.name)}
                                onMouseEnter={() => setHoveredTab(item.name)}
                                onMouseLeave={() => setHoveredTab(null)}
                                className={cn(
                                    "anime-navbar-link",
                                    isActive && "anime-navbar-link--active"
                                )}
                            >
                                {/* Active glow aura */}
                                {isActive && (
                                    <motion.div
                                        className="anime-navbar-glow"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.03, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <div className="anime-navbar-glow__layer anime-navbar-glow__layer--1" />
                                        <div className="anime-navbar-glow__layer anime-navbar-glow__layer--2" />
                                        <div className="anime-navbar-glow__layer anime-navbar-glow__layer--3" />
                                        <div className="anime-navbar-glow__layer anime-navbar-glow__layer--4" />
                                        <div className="anime-navbar-glow__shine" />
                                    </motion.div>
                                )}

                                <motion.span
                                    className="anime-navbar-label"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.name}
                                </motion.span>

                                <AnimatePresence>
                                    {isHovered && !isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="anime-navbar-hover-bg"
                                        />
                                    )}
                                </AnimatePresence>
                            </Link>
                        )
                    })}
                </motion.div>
            </div>

            {/* Mobile Hamburger Button (floating) */}
            <div className="mobile-nav-toggle">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="mobile-hamburger-btn"
                    aria-label="Open Navigation Menu"
                >
                    <Menu size={24} strokeWidth={2.5} color="var(--color-gold)" />
                </button>
            </div>

            {/* Mobile Fullscreen Menu Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mobile-menu-header">
                            <span className="mobile-menu-title">Menu</span>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="mobile-menu-close"
                                aria-label="Close Menu"
                            >
                                <X size={28} strokeWidth={2.5} color="var(--color-gold)" />
                            </button>
                        </div>

                        <div className="mobile-menu-links">
                            {items.map((item, i) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.name;
                                return (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: i * 0.05, duration: 0.2 }}
                                    >
                                        <Link
                                            href={item.url}
                                            onClick={() => {
                                                setActiveTab(item.name);
                                                setIsMobileOpen(false);
                                            }}
                                            className={cn(
                                                "mobile-menu-item",
                                                isActive && "mobile-menu-item--active"
                                            )}
                                        >
                                            <span className="mobile-menu-icon-wrapper">
                                                <Icon size={20} strokeWidth={2.5} />
                                            </span>
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
