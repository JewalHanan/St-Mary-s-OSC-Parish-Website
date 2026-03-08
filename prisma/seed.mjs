import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'dev.db');
const database = new Database(dbPath);
const adapter = new PrismaBetterSqlite3(database);
const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@stmosc.org' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@stmosc.org',
            password_hash: passwordHash,
            role: 'SUPER_ADMIN',
        },
    });

    console.log('Admin user created:', admin);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        database.close();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        database.close();
        process.exit(1);
    });
