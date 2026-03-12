'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSiteSettings, saveSiteSettings, type SiteSettings } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

export default function SiteSettingsManager() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getSiteSettings().then(setSettings);
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            await saveSiteSettings(settings);
            alert('Settings saved successfully!');
        } catch (e: any) {
            alert('Failed to save settings: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!settings) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading settings...</div>;

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '6px',
        border: '1px solid var(--card-border)',
        background: 'var(--input-bg)',
        color: 'var(--text-primary)', fontSize: '1rem', width: '100%',
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: '2rem', padding: '1.5rem', background: 'var(--card-bg)'
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Site Settings</h1>
                    <p>Manage contact details, social links, and the homepage ticker.</p>
                </div>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : '💾 Save All Settings'}
                </Button>
            </header>

            {/* Ticker settings */}
            <Card style={sectionStyle}>
                <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Homepage Ticker</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    By default, the ticker shows the date of the next Sunday Qurbono. You can type a custom message here to override it (e.g. for special announcements). Leave blank to use the default.
                </p>
                <input
                    value={settings.tickerOverride || ''}
                    onChange={(e) => setSettings({ ...settings, tickerOverride: e.target.value })}
                    placeholder="Custom ticker message (leave blank for default)"
                    style={inputStyle}
                />
            </Card>

            {/* Contact details */}
            <Card style={sectionStyle}>
                <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                        <input value={settings.contact.phone} onChange={e => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                        <input value={settings.contact.email} onChange={e => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })} style={inputStyle} />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Address Line 1</label>
                        <input value={settings.contact.addressLine1} onChange={e => setSettings({ ...settings, contact: { ...settings.contact, addressLine1: e.target.value } })} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Address Line 2 (City, ZIP, Country)</label>
                        <input value={settings.contact.addressLine2} onChange={e => setSettings({ ...settings, contact: { ...settings.contact, addressLine2: e.target.value } })} style={inputStyle} />
                    </div>
                </div>

                <h4 style={{ color: 'var(--text-accent)', marginTop: '2rem', marginBottom: '1rem' }}>Service Timings</h4>
                {settings.contact.serviceTimings.map((timing, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <input
                            value={timing.label}
                            onChange={(e) => {
                                const newTimings = [...settings.contact.serviceTimings];
                                newTimings[idx].label = e.target.value;
                                setSettings({ ...settings, contact: { ...settings.contact, serviceTimings: newTimings } });
                            }}
                            placeholder="Service Name (e.g. Sunday Holy Qurbono)"
                            style={{ ...inputStyle, flex: 2 }}
                        />
                        <input
                            value={timing.time}
                            onChange={(e) => {
                                const newTimings = [...settings.contact.serviceTimings];
                                newTimings[idx].time = e.target.value;
                                setSettings({ ...settings, contact: { ...settings.contact, serviceTimings: newTimings } });
                            }}
                            placeholder="Time (e.g. 8:30 AM)"
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <Button
                            variant="secondary"
                            onClick={() => {
                                const newTimings = settings.contact.serviceTimings.filter((_, i) => i !== idx);
                                setSettings({ ...settings, contact: { ...settings.contact, serviceTimings: newTimings } });
                            }}
                            style={{ padding: '0 1rem' }}
                        >🗑️</Button>
                    </div>
                ))}
                <Button
                    variant="outline"
                    onClick={() => {
                        const newTimings = [...settings.contact.serviceTimings, { label: '', time: '' }];
                        setSettings({ ...settings, contact: { ...settings.contact, serviceTimings: newTimings } });
                    }}
                    style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}
                >➕ Add Timing block</Button>
            </Card>

            {/* Social links */}
            <Card style={sectionStyle}>
                <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Social Media Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ width: '30px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.532-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
                        </span>
                        <input
                            value={settings.social.facebook}
                            onChange={e => setSettings({ ...settings, social: { ...settings.social, facebook: e.target.value } })}
                            placeholder="Facebook URL"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ width: '30px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        </span>
                        <input
                            value={settings.social.instagram}
                            onChange={e => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })}
                            placeholder="Instagram URL"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ width: '30px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        </span>
                        <input
                            value={settings.social.whatsapp}
                            onChange={e => setSettings({ ...settings, social: { ...settings.social, whatsapp: e.target.value } })}
                            placeholder="WhatsApp Link (wa.me/...)"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ width: '30px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                        </span>
                        <input
                            value={settings.social.youtube}
                            onChange={e => setSettings({ ...settings, social: { ...settings.social, youtube: e.target.value } })}
                            placeholder="YouTube URL"
                            style={inputStyle}
                        />
                    </div>
                </div>
            </Card>

        </div>
    );
}
