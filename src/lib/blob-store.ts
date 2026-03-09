/**
 * blob-store.ts
 * Thin wrapper around @vercel/blob for storing/retrieving named JSON blobs.
 * Each data collection (slider-images, events, etc.) is a single JSON file in the blob store.
 */

import { put, list, del } from '@vercel/blob';

const BLOB_PREFIX = 'stmosc-data/';

/**
 * Read a named JSON blob. Returns the parsed data, or the supplied default if the blob
 * doesn't exist yet.
 */
export async function readBlob<T>(name: string, defaultData: T): Promise<T> {
    try {
        const { blobs } = await list({ prefix: `${BLOB_PREFIX}${name}` });
        if (blobs.length === 0) return defaultData;

        // Use the most recent blob
        const latest = blobs.sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )[0];

        const res = await fetch(latest.url, { cache: 'no-store' });
        if (!res.ok) return defaultData;
        return (await res.json()) as T;
    } catch (error) {
        console.error(`[blob-store] Failed to read "${name}":`, error);
        return defaultData;
    }
}

/**
 * Write a named JSON blob, replacing the previous version.
 */
export async function writeBlob<T>(name: string, data: T): Promise<void> {
    try {
        // Delete old blobs with this name first
        const { blobs } = await list({ prefix: `${BLOB_PREFIX}${name}` });
        for (const blob of blobs) {
            await del(blob.url);
        }

        // Write new blob
        const json = JSON.stringify(data);
        await put(`${BLOB_PREFIX}${name}.json`, json, {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
        });
    } catch (error) {
        console.error(`[blob-store] Failed to write "${name}":`, error);
        throw error;
    }
}
