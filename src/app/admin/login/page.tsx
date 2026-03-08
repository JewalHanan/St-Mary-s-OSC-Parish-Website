'use client';

import { useState, useCallback, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from '@/styles/AdminLogin.module.css';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000; // 30 seconds
const MAX_EMAIL_LEN = 254;
const MAX_PASS_LEN = 256;

function sanitiseText(value: string, maxLen: number): string {
    return value.trim().slice(0, maxLen);
}

function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ── Rate limiting (client-side) ──────────────────────
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);

    const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
    const lockoutSecondsLeft = lockedUntil
        ? Math.ceil((lockedUntil - Date.now()) / 1000)
        : 0;

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLocked) {
            setError(`Too many failed attempts. Please wait ${lockoutSecondsLeft}s.`);
            return;
        }

        // Sanitise inputs
        const cleanEmail = sanitiseText(email, MAX_EMAIL_LEN);
        const cleanPassword = sanitiseText(password, MAX_PASS_LEN);

        if (!cleanEmail || !cleanPassword) {
            setError('Email and password are required.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: cleanEmail,
                password: cleanPassword,
            });

            if (res?.error) {
                const nextAttempts = attempts + 1;
                setAttempts(nextAttempts);

                if (nextAttempts >= MAX_ATTEMPTS) {
                    setLockedUntil(Date.now() + LOCKOUT_MS);
                    setError(`Too many failed attempts. Account locked for ${LOCKOUT_MS / 1000}s.`);
                } else {
                    const remaining = MAX_ATTEMPTS - nextAttempts;
                    setError(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
                }
            } else {
                // Success — reset counters and redirect
                setAttempts(0);
                setLockedUntil(null);
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [email, password, attempts, isLocked, lockoutSecondsLeft, callbackUrl, router]);

    return (
        <div className={styles.loginContainer}>
            <Card className={styles.loginCard} withGlow>
                <div className={styles.header}>
                    <h2>Admin Access</h2>
                    <p>Sign in to manage the St. Mary's Church website.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    {error && (
                        <div className={styles.errorMessage} role="alert" aria-live="assertive">
                            {error}
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLocked || isLoading}
                            className={styles.input}
                            placeholder="admin@stmosc.org"
                            autoComplete="email"
                            maxLength={MAX_EMAIL_LEN}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLocked || isLoading}
                            className={styles.input}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            maxLength={MAX_PASS_LEN}
                        />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading || isLocked}
                    >
                        {isLocked
                            ? `Locked — wait ${lockoutSecondsLeft}s`
                            : isLoading
                                ? 'Authenticating…'
                                : 'Sign In'}
                    </Button>

                    <div className={styles.footerLink}>
                        <a href="/">Return to Homepage</a>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className={styles.loginContainer}>
                <Card className={styles.loginCard} withGlow>
                    <div className={styles.header}>
                        <h2>Loading...</h2>
                    </div>
                </Card>
            </div>
        }>
            <AdminLoginForm />
        </Suspense>
    );
}
