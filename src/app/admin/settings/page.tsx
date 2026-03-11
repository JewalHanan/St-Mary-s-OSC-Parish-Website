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
                        <span style={{ fontSize: '1.5rem', width: '30px' }}>📘</span>
                        <input
                            value={settings.social.facebook}
                            onChange={e => setSettings({ ...settings, social: { ...settings.social, facebook: e.target.value } })}
                            placeholder="Facebook URL"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem', width: '30px' }}>📸</span>
                        <input
                            value={settings.social.instagram}
                            onChange={e => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })}
                            placeholder="Instagram URL"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem', width: '30px' }}>📱</span>
                        <input
                            value={settings.social.whatsapp}
                            onChange={e => setSettings({ ...settings, social: { ...settings.social, whatsapp: e.target.value } })}
                            placeholder="WhatsApp Link (wa.me/...)"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem', width: '30px' }}>▶️</span>
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
