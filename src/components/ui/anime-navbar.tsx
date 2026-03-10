"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
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

    useEffect(() => { setMounted(true) }, [])
    if (!mounted) return null

    return (
        <div className="anime-navbar-wrapper">
            <div className="anime-navbar-center">
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

                                {/* Desktop: text label */}
                                <motion.span
                                    className="anime-navbar-label"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.name}
                                </motion.span>

                                {/* Mobile: icon */}
                                <motion.span
                                    className="anime-navbar-icon"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Icon size={18} strokeWidth={2.5} />
                                </motion.span>

                                {/* Hover highlight */}
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
        </div>
    )
}
