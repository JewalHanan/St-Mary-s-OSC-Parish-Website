'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { getOrganisations, type Organisation } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';
import styles from '@/styles/Organisations.module.css';

export default function MinistriesPage() {
    const { data: organisations, loading } = useStoreData(getOrganisations, [] as Organisation[]);

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            <p>Loading...</p>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Church Ministries</h1>
                <p>Explore the vibrant groups that form the pillars of our church community.</p>
            </motion.div>

            <div className={styles.orgList}>
                {organisations.map((org, index) => (
                    <motion.section
                        key={org.id}
                        className={styles.orgSection}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.orgHeader}>
                            {org.logo
                                ? <img src={org.logo} alt={org.name} style={{ width: 64, height: 64, borderRadius: '14px', objectFit: 'cover', border: '3px solid var(--accent-primary)', flexShrink: 0 }} />
                                : <div className={styles.orgLogoPlaceholder}>{org.name.charAt(0)}</div>
                            }
                            <div className={styles.orgTitleArea}>
                                <h2>{org.name}</h2>
                            </div>
                        </div>

                        <div className={styles.leadersGrid}>
                            {org.bearers.map((bearer) => (
                                <Card key={bearer.id} className={styles.leaderCard} glowVariant="maroon" glowSpread={35} glowBorderWidth={2}>
                                    {bearer.image ? (
                                        <img
                                            src={bearer.image}
                                            alt={bearer.name}
                                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)', margin: '0 auto 1rem', display: 'block' }}
                                        />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', border: '3px solid var(--card-border)' }}>
                                            👤
                                        </div>
                                    )}
                                    <h3>{bearer.name}</h3>
                                    <div className={styles.roleBadge}>{bearer.position}</div>
                                    {bearer.contact && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{bearer.contact}</p>
                                    )}
                                </Card>
                            ))}
                            {org.bearers.length === 0 && (
                                <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', padding: '1rem' }}>
                                    No office bearers assigned yet.
                                </p>
                            )}
                        </div>

                        {index < organisations.length - 1 && (
                            <div className={styles.divider}>
                                <span className={styles.cross}>✝️</span>
                            </div>
                        )}
                    </motion.section>
                ))}
            </div>
        </div>
    );
}
