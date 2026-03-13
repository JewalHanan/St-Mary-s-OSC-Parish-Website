import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const publications = await prisma.publication.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(publications);
    } catch (error) {
        console.error('[api/publications] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const publication = await prisma.publication.create({
            data: {
                name: body.name,
                description: body.description,
                file_url: body.file_url,
                file_name: body.file_name,
            },
        });
        return NextResponse.json(publication, { status: 201 });
    } catch (error) {
        console.error('[api/publications] POST error:', error);
        return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const publication = await prisma.publication.update({
            where: { id: body.id },
            data: {
                name: body.name,
                description: body.description,
                file_url: body.file_url,
                file_name: body.file_name,
            },
        });
        return NextResponse.json(publication);
    } catch (error) {
        console.error('[api/publications] PUT error:', error);
        return NextResponse.json({ error: 'Failed to update publication' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await prisma.publication.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[api/publications] DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
    }
}
