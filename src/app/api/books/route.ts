import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const book = await prisma.book.create({
            data: {
                title: body.title,
                language: body.language,
                file_url: body.file_url,
                image_url: body.image_url,
                section_id: body.section_id,
            },
        });
        return NextResponse.json(book, { status: 201 });
    } catch (error) {
        console.error('[api/books] POST error:', error);
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const book = await prisma.book.update({
            where: { id: body.id },
            data: {
                title: body.title,
                language: body.language,
                file_url: body.file_url,
                image_url: body.image_url,
                section_id: body.section_id,
            },
        });
        return NextResponse.json(book);
    } catch (error) {
        console.error('[api/books] PUT error:', error);
        return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await prisma.book.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[api/books] DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
}
