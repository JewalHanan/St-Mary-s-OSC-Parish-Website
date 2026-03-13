/**
 * useStoreData — React hook for fetching async store data with auto-polling.
 * Automatically re-fetches data on an interval so public pages always
 * show the latest admin-managed content without manual refresh.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_POLL_INTERVAL = 300_000; // 5 minutes

export function useStoreData<T>(
    fetcher: () => Promise<T>,
    initialData: T,
    pollInterval: number = DEFAULT_POLL_INTERVAL
): { data: T; loading: boolean; refresh: () => void } {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState(true);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const refresh = useCallback(() => {
        setLoading(true);
        fetcherRef.current()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Initial fetch
    useEffect(() => {
        refresh();
    }, [refresh]);

    // Polling interval for live sync
    useEffect(() => {
        if (pollInterval <= 0) return;
        const id = setInterval(() => {
            fetcherRef.current()
                .then(setData)
                .catch(console.error);
        }, pollInterval);
        return () => clearInterval(id);
    }, [pollInterval]);

    return { data, loading, refresh };
}
