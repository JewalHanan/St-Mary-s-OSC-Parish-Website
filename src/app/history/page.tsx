'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getParishHistory, type ParishHistory } from '@/lib/store';

export default function HistoryPage() {
    const [history, setHistory] = useState<ParishHistory | null>(null);

    useEffect(() => {
        getParishHistory().then(setHistory);
    }, []);

    return (
        <div style={{ padding: '2rem 1rem 4rem', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <div style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: 'var(--shadow-glow)' }}>
                    ⛪
                </div>
                <h1 style={{ fontFamily: 'var(--font-heading-system)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-accent)', marginBottom: '1rem' }}>
                    Parish History
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    The journey and heritage of St. Mary&apos;s Malankara Orthodox Church.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Card withGlow style={{ padding: 'clamp(2rem, 5vw, 4rem)', minHeight: '400px' }}>
                    {!history ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                            <p>Loading history...</p>
                        </div>
                    ) : (
                        <div 
                            style={{ 
                                lineHeight: '1.8', 
                                color: 'var(--text-primary)',
                                fontSize: '1.1rem'
                            }}
                            className="rich-text-content"
                            dangerouslySetInnerHTML={{ __html: history.content }} 
                        />
                    )}
                </Card>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
