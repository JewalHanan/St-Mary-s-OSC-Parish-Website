'use server';

import { prisma } from '@/lib/prisma';

export async function getBookSections() {
    try {
        const sections = await prisma.bookSection.findMany({
            orderBy: { order: 'asc' },
            include: {
                books: true,
            },
        });
        return sections;
    } catch (error) {
        console.error('Error fetching book sections:', error);
        return [];
    }
}
