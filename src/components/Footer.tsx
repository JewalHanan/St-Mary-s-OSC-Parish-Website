import Link from 'next/link';
import { getSiteSettings } from '@/lib/store';
import styles from '@/styles/Footer.module.css';

/* ── Official SVG brand icons for social links ── */
function FacebookIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.532-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z" />
        </svg>
    );
}

export default async function Footer() {
    const settings = await getSiteSettings();
    const { contact, social } = settings;

    // Build tel: link from stored phone number
    const telLink = contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : null;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Church identity header */}
                <div className={styles.header}>
                    <img src="/images/logo.png" alt="St. Mary's Church Logo" className={styles.logo} />
                    <h2 className={styles.churchName}>St. Mary&apos;s Malankara Orthodox Syrian Church</h2>
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
                            {/* Phone icon — tapping opens dialler */}
                            {telLink && (
                                <a href={telLink} aria-label={`Call us: ${contact.phone}`} title={contact.phone}>
                                    <PhoneIcon />
                                </a>
                            )}
                            {social.whatsapp && (
                                <a href={social.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                                    <WhatsAppIcon />
                                </a>
                            )}
                            {social.instagram && (
                                <a href={social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" title="Instagram">
                                    <InstagramIcon />
                                </a>
                            )}
                            {social.facebook && (
                                <a href={social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" title="Facebook">
                                    <FacebookIcon />
                                </a>
                            )}
                            {social.youtube && (
                                <a href={social.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer" title="YouTube">
                                    <YoutubeIcon />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>
                        &copy; {new Date().getFullYear()} St. Mary&apos;s Malankara Orthodox Syrian Church, Muthupilakkadu.
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
