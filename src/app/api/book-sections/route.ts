import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const sections = await prisma.bookSection.findMany({
            include: {
                books: true,
            },
            orderBy: {
                order: 'asc',
            },
        });
        return NextResponse.json(sections);
    } catch (error) {
        console.error('[api/book-sections] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch book sections' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const section = await prisma.bookSection.create({
            data: {
                title: body.title,
                image_url: body.image_url,
                order: body.order || 0,
            },
        });
        return NextResponse.json(section, { status: 201 });
    } catch (error) {
        console.error('[api/book-sections] POST error:', error);
        return NextResponse.json({ error: 'Failed to create book section' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const section = await prisma.bookSection.update({
            where: { id: body.id },
            data: {
                title: body.title,
                image_url: body.image_url,
                order: body.order,
            },
        });
        return NextResponse.json(section);
    } catch (error) {
        console.error('[api/book-sections] PUT error:', error);
        return NextResponse.json({ error: 'Failed to update book section' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await prisma.bookSection.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[api/book-sections] DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete book section' }, { status: 500 });
    }
}
