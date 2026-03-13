/**
 * blob-store.ts
 * Storage layer using Cloudflare R2 (S3-compatible).
 * Replaces @vercel/blob entirely.
 * readBlob / writeBlob signatures are unchanged so no other files need editing.
 */

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const DATA_PREFIX = 'stmosc-data/';

function hasR2Config(): boolean {
    return !!(
        process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY &&
        process.env.R2_BUCKET_NAME
    );
}

function getR2Client(): S3Client {
    return new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    });
}

/**
 * Read a named JSON object from R2.
 * Returns defaultData if the key does not exist or R2 is not configured.
 */
export async function readBlob<T>(name: string, defaultData: T): Promise<T> {
    if (!hasR2Config()) {
        console.warn(`[blob-store] R2 not configured — returning default for "${name}"`);
        return defaultData;
    }

    try {
        const result = await getR2Client().send(new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: `${DATA_PREFIX}${name}.json`,
        }));

        const body = await result.Body?.transformToString();
        if (!body) return defaultData;
        return JSON.parse(body) as T;

    } catch (err: any) {
        // NoSuchKey means the file just does not exist yet — return default silently
        if (err?.name === 'NoSuchKey' || err?.Code === 'NoSuchKey') {
            return defaultData;
        }
        console.error(`[blob-store] readBlob "${name}" failed:`, err);
        return defaultData;
    }
}

/**
 * Write a named JSON object to R2, replacing any previous version.
 * No-ops if R2 is not configured.
 */
export async function writeBlob<T>(name: string, data: T): Promise<void> {
    if (!hasR2Config()) {
        console.warn(`[blob-store] R2 not configured — cannot write "${name}"`);
        return;
    }

    try {
        await getR2Client().send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: `${DATA_PREFIX}${name}.json`,
            Body: JSON.stringify(data),
            ContentType: 'application/json',
        }));
    } catch (err) {
        console.error(`[blob-store] writeBlob "${name}" failed:`, err);
        throw err;
    }
}
