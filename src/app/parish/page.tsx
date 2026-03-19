'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import styles from '@/styles/Parish.module.css';

import { getParishMembers, type ParishMember } from '@/lib/store';
import { useStoreData } from '@/lib/useStoreData';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, z: -100, rotateX: 20 },
    visible: {
        opacity: 1,
        z: 0,
        rotateX: 0,
        transition: { type: 'spring' as const, damping: 20, stiffness: 100 }
    }
};

export default function ParishPage() {
    const { data: members, loading } = useStoreData(getParishMembers, [] as ParishMember[]);

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            <p>Loading...</p>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Parish Managing Committee</h1>
                <p>Meet the dedicated members serving our church community for the year 2026-2027.</p>
            </motion.div>

            <motion.div
                className={styles.grid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {members.map((member) => (
                    <motion.div key={member.id} variants={cardVariants} className={styles.cardContainer}>
                        <Card className={styles.memberCard} glowVariant="maroon" glowSpread={40} glowBorderWidth={2}>
                            <div className={styles.flipCardInner}>
                                {/* FRONT FACE */}
                                <div className={styles.flipCardFront}>
                                    <div className={styles.frontPhotoWrapper}>
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className={styles.frontPhoto}
                                            />
                                        ) : (
                                            <div className={styles.photoPlaceholder}>
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.frontStrip}>
                                        <h3 className={styles.nameFront}>{member.name}</h3>
                                        <p className={styles.roleFront}>{member.role}</p>
                                    </div>
                                </div>

                                {/* BACK FACE */}
                                <div className={styles.flipCardBack}>
                                    <h3 className={styles.nameBack}>{member.name}</h3>
                                    <p className={styles.roleBack}>{member.role}</p>
                                    
                                    <div className={styles.divider} />
                                    
                                    <div className={styles.details}>
                                        {member.phone && (
                                            <a href={`tel:${member.phone}`}>
                                                <span className={styles.detailsIcon}>📞</span> {member.phone}
                                            </a>
                                        )}
                                        {member.email && (
                                            <a href={`mailto:${member.email}`}>
                                                <span className={styles.detailsIcon}>✉️</span> {member.email}
                                            </a>
                                        )}
                                        {member.area && (
                                            <p>
                                                <span className={styles.detailsIcon}>📍</span> {member.area}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
