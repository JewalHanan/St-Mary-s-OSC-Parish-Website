'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    width?: "fit" | "full";
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    duration?: number;
    amount?: number | "all" | "some";
}

export const ScrollReveal = ({
    children,
    width = "full",
    delay = 0,
    direction = "up",
    distance = 40,
    duration = 0.8,
    amount = 0.3, // Trigger when 30% of element is in view
    className,
    style,
    ...props
}: ScrollRevealProps) => {

    const directionOffset = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
        none: { x: 0, y: 0 }
    };

    const initialOffset = directionOffset[direction];

    return (
        <motion.div
            initial={{ opacity: 0, ...initialOffset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount }}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.16, 1, 0.3, 1], // Custom Apple-style spring-like decelerating cubic bezier
            }}
            className={className}
            style={{ ...style, width: width === "full" ? '100%' : 'fit-content' }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
