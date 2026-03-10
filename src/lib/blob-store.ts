/**
 * blob-store.ts
 * Thin wrapper around @vercel/blob for storing/retrieving named JSON blobs.
 * Each data collection (slider-images, events, etc.) is a single JSON file in the blob store.
 *
 * Gracefully handles missing BLOB_READ_WRITE_TOKEN — returns default data
 * instead of crashing, so the site works (with defaults) even before the
 * blob store is configured.
 */

const BLOB_PREFIX = 'stmosc-data/';

function hasBlobToken(): boolean {
    return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/**
 * Read a named JSON blob. Returns the parsed data, or the supplied default if:
 * - The blob doesn't exist yet
 * - BLOB_READ_WRITE_TOKEN is not configured
 * - Any error occurs
 */
export async function readBlob<T>(name: string, defaultData: T): Promise<T> {
    if (!hasBlobToken()) {
        console.warn(`[blob-store] BLOB_READ_WRITE_TOKEN not set — returning default data for "${name}"`);
        return defaultData;
    }

    try {
        const { list } = await import('@vercel/blob');
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
 * No-ops if BLOB_READ_WRITE_TOKEN is not set.
 */
export async function writeBlob<T>(name: string, data: T): Promise<void> {
    if (!hasBlobToken()) {
        console.warn(`[blob-store] BLOB_READ_WRITE_TOKEN not set — cannot write "${name}"`);
        return;
    }

    try {
        const { put, list, del } = await import('@vercel/blob');

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
