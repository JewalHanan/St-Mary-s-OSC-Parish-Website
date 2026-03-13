'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { getParishHistory, type ParishHistory } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';

export default function HistoryPage() {
    const { data: history } = useStoreData(getParishHistory, null as ParishHistory | null);

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
                {/* Written content */}
                <Card withGlow style={{ padding: 'clamp(2rem, 5vw, 4rem)', minHeight: '400px', marginBottom: '2rem' }}>
                    {!history ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                            <p>Loading history...</p>
                        </div>
                    ) : (
                        <div
                            style={{ lineHeight: '1.8', color: 'var(--text-primary)', fontSize: '1.1rem' }}
                            className="rich-text-content"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(history.content) }}
                        />
                    )}
                </Card>

                {/* History Images — 16:9 grid */}
                {history && history.images && history.images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2 style={{
                            fontFamily: 'var(--font-heading-system)',
                            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                            color: 'var(--text-accent)',
                            textAlign: 'center',
                            marginBottom: '1.5rem',
                        }}>
                            📸 Photo Gallery
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '1.25rem',
                            marginBottom: '2rem',
                        }}>
                            {history.images.map((img, i) => (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    style={{
                                        borderRadius: '14px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--card-bg)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    }}
                                >
                                    {/* Original aspect ratio */}
                                    <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={img.url}
                                            alt={img.caption || 'Parish History Photo'}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </div>
                                    {img.caption && (
                                        <p style={{
                                            padding: '0.75rem 1rem',
                                            margin: 0,
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            textAlign: 'center',
                                            lineHeight: 1.5,
                                        }}>
                                            {img.caption}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
