/**
 * Dynamic API route for all data collections.
 * GET  /api/data/[collection] → public, returns JSON
 * PUT  /api/data/[collection] → admin-only, saves JSON to Vercel Blob
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readBlob, writeBlob } from '@/lib/blob-store';

// Valid collection names — must match the keys used by store.ts
const VALID_COLLECTIONS = new Set([
    'slider-images',
    'events',
    'prayer-requests',
    'book-sections',
    'parish-members',
    'special-days',
    'organisations',
    'event-banners',
    'site-settings',
    'parish-history',
    'gallery-sections',
    'publications',
]);

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ collection: string }> }
) {
    const { collection } = await params;

    if (!VALID_COLLECTIONS.has(collection)) {
        return NextResponse.json({ error: 'Invalid collection' }, { status: 404 });
    }

    try {
        const data = await readBlob(collection, null);
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error(`[api/data] GET ${collection} error:`, error);
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ collection: string }> }
) {
    const { collection } = await params;

    if (!VALID_COLLECTIONS.has(collection)) {
        return NextResponse.json({ error: 'Invalid collection' }, { status: 404 });
    }

    // Auth check — only admin users can write
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        await writeBlob(collection, body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`[api/data] PUT ${collection} error:`, error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
