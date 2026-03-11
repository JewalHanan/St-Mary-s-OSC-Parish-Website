'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export function SessionSlidingWindow() {
    const { status, update } = useSession();
    const lastUpdateRef = useRef<number>(Date.now());
    
    // Throttle session updates to once every 2 minutes minimum
    // to avoid spamming the NextAuth endpoint on every scroll/click.
    const UPDATE_THRESHOLD_MS = 2 * 60 * 1000; 

    useEffect(() => {
        if (status !== 'authenticated') return;

        const handleActivity = () => {
            const now = Date.now();
            if (now - lastUpdateRef.current > UPDATE_THRESHOLD_MS) {
                lastUpdateRef.current = now;
                // update() forces NextAuth to refresh the JWT token, extending its maxAge (30m)
                update();
            }
        };

        // Events that qualify as user activity
        const options = { passive: true };
        window.addEventListener('mousedown', handleActivity, options);
        window.addEventListener('keydown', handleActivity, options);
        window.addEventListener('scroll', handleActivity, options);
        window.addEventListener('touchstart', handleActivity, options);

        return () => {
            window.removeEventListener('mousedown', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
        };
    }, [status, update]);

    return null; // This is a purely logic-based component
}
