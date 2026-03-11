import Link from 'next/link';
import { getSiteSettings } from '@/lib/store';
import styles from '@/styles/Footer.module.css';

export default async function Footer() {
    const settings = await getSiteSettings();
    const { contact, social } = settings;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Church identity header */}
                <div className={styles.header}>
                    <img src="/images/logo.png" alt="St. Mary's Church Logo" className={styles.logo} />
                    <h2 className={styles.churchName}>St. Mary's Malankara Orthodox Church</h2>
                    <p className={styles.diocese}>Under the Kollam Diocese, Malankara Orthodox Syrian Church</p>
                </div>

                {/* Content grid */}
                <div className={styles.contentGrid}>
                    {/* Service times */}
                    <div className={styles.section}>
                        <h3>Service Times</h3>
                        {contact.serviceTimings.map((timing, i) => (
                            <p key={i}><strong>{timing.label}:</strong> {timing.time}</p>
                        ))}
                    </div>

                    {/* Quick links */}
                    <div className={styles.section}>
                        <h3>Quick Links</h3>
                        <ul className={styles.linksList}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/books">Service Books</Link></li>
                            <li><Link href="/calendar">Church Calendar</Link></li>
                            <li><Link href="/prayer-requests">Prayer Request</Link></li>
                            <li><Link href="/ministries">Ministries</Link></li>
                            <li><Link href="/parish">Parish Committee</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.section}>
                        <h3>Connect With Us</h3>
                        <p>{contact.addressLine1}</p>
                        <p>{contact.addressLine2}</p>
                        <div className={styles.socials}>
                            {social.whatsapp && (
                                <a href={social.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" title="WhatsApp">📱</a>
                            )}
                            {social.instagram && (
                                <a href={social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" title="Instagram">📸</a>
                            )}
                            {social.facebook && (
                                <a href={social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" title="Facebook">📘</a>
                            )}
                            {social.youtube && (
                                <a href={social.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer" title="YouTube">▶️</a>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>
                        &copy; {new Date().getFullYear()} St. Mary's Malankara Orthodox Church, Muthupilakkadu.
                        All rights reserved.
                    </p>
                    <Link
                        href="/admin/login"
                        className={styles.adminLink}
                        aria-label="Admin panel"
                    >
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
}
