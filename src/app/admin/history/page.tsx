'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getParishHistory, saveParishHistory, type ParishHistory } from '@/lib/store';
import styles from '@/styles/AdminDashboard.module.css';

export default function AdminHistoryPage() {
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getParishHistory().then(history => {
            setContent(history.content);
            setIsLoading(false);
        }).catch(() => {
            setMessage({ text: 'Failed to load history', type: 'error' });
            setIsLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ text: '', type: '' });
        
        try {
            await saveParishHistory({ content });
            setMessage({ text: 'History successfully updated!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: 'Failed to save history. Please try again.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.dashboardContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Parish History</h1>
                </div>
                <Card><p>Loading editor...</p></Card>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Parish History Editor</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Edit the history of the church displayed publicly on the &quot;Learn More About Us&quot; page. You can use standard HTML formatting tags like &lt;b&gt;, &lt;i&gt;, &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, and &lt;ul&gt; for lists.
                </p>
            </div>

            <Card style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontWeight: 'bold', color: 'var(--text-accent)' }}>History Content (HTML Supported)</label>
                    <textarea 
                        className="styled-input"
                        style={{ minHeight: '400px', fontFamily: 'monospace', lineHeight: '1.5' }} 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="<p>Enter the parish history here...</p>"
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        {message.text && (
                            <span style={{ 
                                color: message.type === 'success' ? '#2e7d32' : 'var(--accent-secondary)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                fontWeight: 'bold' 
                            }}>
                                {message.text}
                            </span>
                        )}
                        <Button 
                            variant="primary" 
                            onClick={handleSave} 
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : '💾 Save Changes'}
                        </Button>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Live Preview</h3>
                <div 
                    style={{ 
                        padding: '1.5rem', 
                        background: 'var(--input-bg)', 
                        borderRadius: 'var(--radius-sm)', 
                        minHeight: '200px' 
                    }}
                >
                    {content ? (
                         <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Preview will appear here...</p>
                    )}
                </div>
            </Card>
        </div>
    );
}
