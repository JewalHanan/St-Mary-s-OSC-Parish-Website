import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Demo admin credentials (in production, these come from the database)
const DEMO_ADMIN = {
    id: '1',
    name: 'Super Admin',
    email: 'admin@stmosc.org',
    // bcrypt hash for 'admin123'
    password_hash: '$2a$10$C82aM7x7f1I8L1yR9B.Q5O8O1A9X0t4Fm2dZ/y9c6qE1Z0d7Y1f5.',
    role: 'SUPER_ADMIN',
};


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                // Demo mode: check against hardcoded admin
                if (credentials.email === DEMO_ADMIN.email) {
                    // Check against plaintext for the hardcoded demo account
                    const isCorrectPassword = credentials.password === 'admin123';

                    if (isCorrectPassword) {
                        return {
                            id: DEMO_ADMIN.id,
                            name: DEMO_ADMIN.name,
                            email: DEMO_ADMIN.email,
                            role: DEMO_ADMIN.role,
                        };
                    }
                }

                throw new Error('Invalid credentials');
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
};
