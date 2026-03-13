'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getOrganisations, saveOrganisations, nextId, type Organisation, type OrgBearer } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';
import { validateImageFile } from '@/lib/uploadValidation';

export default function MinistriesManager() {
    const [orgs, setOrgs] = useState<Organisation[]>([]);
    const [expandedOrgId, setExpandedOrgId] = useState<number | null>(null);
    const [editingBearer, setEditingBearer] = useState<{ orgId: number; bearerId: number | null } | null>(null);
    const [bearerForm, setBearerForm] = useState({ name: '', position: '', contact: '', image: '' });
    const [newOrgName, setNewOrgName] = useState('');
    const [newOrgLogo, setNewOrgLogo] = useState('');
    const [showAddOrg, setShowAddOrg] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const orgLogoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { getOrganisations().then(setOrgs); }, []);

    const persist = async (updated: Organisation[]) => {
        setOrgs(updated);
        await saveOrganisations(updated);
    };

    const addOrg = () => {
        if (!newOrgName.trim()) return alert('Ministry name is required.');
        persist([...orgs, { id: nextId(orgs), name: newOrgName.trim(), logo: newOrgLogo || undefined, bearers: [] }]);
        setNewOrgName('');
        setNewOrgLogo('');
        setShowAddOrg(false);
    };

    const handleOrgLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setNewOrgLogo(reader.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const deleteOrg = (id: number) => {
        if (confirm('Delete this ministry and all its bearers?')) {
            persist(orgs.filter(o => o.id !== id));
        }
    };

    const openAddBearer = (orgId: number) => {
        setEditingBearer({ orgId, bearerId: null });
        setBearerForm({ name: '', position: '', contact: '', image: '' });
    };

    const openEditBearer = (orgId: number, bearer: OrgBearer) => {
        setEditingBearer({ orgId, bearerId: bearer.id });
        setBearerForm({ name: bearer.name, position: bearer.position, contact: bearer.contact, image: bearer.image || '' });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validationError = validateImageFile(file);
        if (validationError) { alert(validationError); e.target.value = ''; return; }

        const reader = new FileReader();
        reader.onload = () => setBearerForm(prev => ({ ...prev, image: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const saveBearer = () => {
        if (!bearerForm.name || !bearerForm.position) return alert('Name and Position are required.');
        if (!editingBearer) return;

        const { orgId, bearerId } = editingBearer;

        persist(orgs.map(org => {
            if (org.id !== orgId) return org;
            if (bearerId === null) {
                return { ...org, bearers: [...org.bearers, { id: nextId(org.bearers), ...bearerForm }] };
            } else {
                return { ...org, bearers: org.bearers.map(b => b.id === bearerId ? { ...b, ...bearerForm } : b) };
            }
        }));
        setEditingBearer(null);
    };

    const deleteBearer = (orgId: number, bearerId: number) => {
        if (confirm('Remove this office bearer?')) {
            persist(orgs.map(org =>
                org.id === orgId ? { ...org, bearers: org.bearers.filter(b => b.id !== bearerId) } : org
            ));
        }
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '6px',
        border: '1px solid var(--card-border)',
        background: 'var(--input-bg)',
        color: 'var(--text-primary)', fontSize: '1rem', width: '100%',
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Ministries</h1>
                    <p>Manage church ministries and their office bearers. ({orgs.length} ministries)</p>
                </div>
                <Button variant="primary" onClick={() => setShowAddOrg(true)}>➕ Add Ministry</Button>
            </header>

            {showAddOrg && (
                <Card style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--card-bg)' }}>
                    <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>New Ministry</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div onClick={() => orgLogoInputRef.current?.click()} style={{ width: 56, height: 56, borderRadius: '12px', border: '2px dashed var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, background: 'var(--input-bg)' }}>
                            {newOrgLogo ? <img src={newOrgLogo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.5rem' }}>🏛️</span>}
                        </div>
                        <input ref={orgLogoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleOrgLogoUpload} />
                        <input value={newOrgName} onChange={e => setNewOrgName(e.target.value)} placeholder="Ministry Name (e.g. OCYM)" style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
                        <Button variant="primary" onClick={addOrg}>Save</Button>
                        <Button variant="outline" onClick={() => { setShowAddOrg(false); setNewOrgLogo(''); }}>Cancel</Button>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Click the logo square to upload a symbol/icon for this ministry.</p>
                </Card>
            )}

            {orgs.map(org => (
                <Card key={org.id} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--card-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 200 }} onClick={() => setExpandedOrgId(expandedOrgId === org.id ? null : org.id)}>
                            {org.logo
                                ? <img src={org.logo} alt={org.name} style={{ width: 52, height: 52, borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--accent-primary)', flexShrink: 0 }} />
                                : <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-navy)', flexShrink: 0 }}>{org.name.charAt(0)}</div>
                            }
                            <div>
                                <h2 style={{ color: 'var(--text-accent)', fontSize: '1.4rem', fontFamily: 'var(--font-heading-system)', margin: 0 }}>
                                    {expandedOrgId === org.id ? '▼' : '▶'} {org.name}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{org.bearers.length} bearer(s)</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button variant="outline" onClick={() => openAddBearer(org.id)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                ➕ Add Bearer
                            </Button>
                            <Button variant="secondary" onClick={() => deleteOrg(org.id)} style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}>
                                🗑️ Delete
                            </Button>
                        </div>
                    </div>

                    {expandedOrgId === org.id && (
                        <div style={{ marginTop: '1rem' }}>
                            {org.bearers.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No office bearers yet. Click &quot;Add Bearer&quot; to add one.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                    {org.bearers.map(bearer => (
                                        <Card key={bearer.id} style={{ padding: '1.25rem', textAlign: 'center', background: 'var(--input-bg)' }}>
                                            {bearer.image ? (
                                                <img src={bearer.image} alt={bearer.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)', margin: '0 auto 1rem' }} />
                                            ) : (
                                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', border: '3px solid var(--card-border)' }}>👤</div>
                                            )}
                                            <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.25rem' }}>{bearer.name}</h4>
                                            <p style={{ color: 'var(--text-accent)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{bearer.position}</p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{bearer.contact}</p>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '1rem' }}>
                                                <Button variant="outline" onClick={() => openEditBearer(org.id, bearer)} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>✏️</Button>
                                                <Button variant="secondary" onClick={() => deleteBearer(org.id, bearer.id)} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>🗑️</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            ))}

            {/* Add / Edit Bearer Modal */}
            {editingBearer && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '480px', background: 'var(--card-bg)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--text-accent)', marginBottom: '1.5rem' }}>
                            {editingBearer.bearerId === null ? 'Add Office Bearer' : 'Edit Office Bearer'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, background: 'var(--input-bg)' }}
                                >
                                    {bearerForm.image ? (
                                        <img src={bearerForm.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '1.5rem' }}>📷</span>
                                    )}
                                </div>
                                <div>
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Upload Photo</Button>
                                    {bearerForm.image && (
                                        <Button variant="secondary" onClick={() => setBearerForm({ ...bearerForm, image: '' })} style={{ padding: '6px 12px', fontSize: '0.85rem', marginLeft: '8px' }}>Remove</Button>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </div>

                            <input value={bearerForm.name} onChange={e => setBearerForm({ ...bearerForm, name: e.target.value })} placeholder="Full Name *" style={inputStyle} />
                            <input value={bearerForm.position} onChange={e => setBearerForm({ ...bearerForm, position: e.target.value })} placeholder="Position * (e.g. President, Secretary)" style={inputStyle} />
                            <input value={bearerForm.contact} onChange={e => setBearerForm({ ...bearerForm, contact: e.target.value })} placeholder="Contact (phone / email)" style={inputStyle} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setEditingBearer(null)}>Cancel</Button>
                            <Button variant="primary" onClick={saveBearer}>Save Bearer</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
