// Prisma client singleton for use in Server Actions.
// In Prisma V7 with SQLite, the client is instantiated via an adapter.
// If the adapter fails to initialize, we export a null-safe proxy.

let prisma: any;

try {
    const { PrismaClient } = require('@prisma/client');
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
    const Database = require('better-sqlite3');
    const path = require('path');

    const globalForPrisma = globalThis as unknown as { prisma: any };

    if (globalForPrisma.prisma) {
        prisma = globalForPrisma.prisma;
    } else {
        const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
        const database = new Database(dbPath);
        const adapter = new PrismaBetterSqlite3(database);
        prisma = new PrismaClient({ adapter });
        if (process.env.NODE_ENV !== 'production') {
            globalForPrisma.prisma = prisma;
        }
    }
} catch (e) {
    console.warn('⚠️ Prisma client failed to initialize. Database features are unavailable.', (e as Error).message);
    // Create a proxy that returns empty results for any model query
    prisma = new Proxy({}, {
        get: () => new Proxy({}, {
            get: () => async () => null,
        }),
    });
}

export { prisma };
