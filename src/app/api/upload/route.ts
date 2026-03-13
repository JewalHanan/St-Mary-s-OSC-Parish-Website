import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    // Auth check — only admin users can upload
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized — please log in again' }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('[api/upload] BLOB_READ_WRITE_TOKEN is not set');
        return NextResponse.json({ error: 'Server misconfigured — BLOB_READ_WRITE_TOKEN is missing' }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const prefix = formData.get('prefix') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename = `${prefix}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const blob = await put(filename, buffer, {
            access: 'public',
            contentType: file.type,
        });

        return NextResponse.json({ url: blob.url });
    } catch (error: any) {
        console.error('[api/upload] POST error:', error);
        const msg = error?.message || 'Failed to upload file';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
