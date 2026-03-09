/**
 * useStoreData — React hook for fetching async store data with auto-refresh.
 * Replaces the old pattern of `useEffect(() => { setData(getSomething()); }, [])`.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export function useStoreData<T>(
    fetcher: () => Promise<T>,
    initialData: T
): { data: T; loading: boolean; refresh: () => void } {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        setLoading(true);
        fetcher()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [fetcher]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { data, loading, refresh };
}
