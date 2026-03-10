import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
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
                        <p>Holy Qurbono</p>
                        <p><strong>Every Sunday at 8:30 AM</strong></p>
                        <p style={{ marginTop: '0.75rem', opacity: 0.8, fontSize: '0.9rem' }}>
                            Muthupilakkadu, Kollam<br />
                            Kerala — 691 578, India
                        </p>
                    </div>

                    {/* Quick links */}
                    <div className={styles.section}>
                        <h3>Quick Links</h3>
                        <ul className={styles.linksList}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/books">Service Books</Link></li>
                            <li><Link href="/calendar">Church Calendar</Link></li>
                            <li><Link href="/prayer-requests">Prayer Request</Link></li>
                            <li><Link href="/organisations">Organisations</Link></li>
                            <li><Link href="/parish">Parish Committee</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.section}>
                        <h3>Connect With Us</h3>
                        <p>Muthupilakkadu, Kollam</p>
                        <p>Kerala — 691 578, India</p>
                        <div className={styles.socials}>
                            <a
                                href="https://wa.me/"
                                aria-label="WhatsApp"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp"
                            >📱</a>
                            <a
                                href="https://instagram.com/"
                                aria-label="Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Instagram"
                            >📸</a>
                            <a
                                href="https://facebook.com/"
                                aria-label="Facebook"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Facebook"
                            >📘</a>
                            <a
                                href="https://youtube.com/"
                                aria-label="YouTube"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="YouTube"
                            >▶️</a>
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
