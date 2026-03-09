'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getParishMembers, saveParishMembers, nextId, type ParishMember } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';
import { validateImageFile } from '@/lib/uploadValidation';

export default function ParishCommitteeManager() {
    const [members, setMembers] = useState<ParishMember[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: '', role: '', area: '', email: '', phone: '', image: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { getParishMembers().then(setMembers); }, []);

    const persist = async (updated: ParishMember[]) => {
        setMembers(updated);
        await saveParishMembers(updated);
    };

    const openAdd = () => {
        setEditingId(0);
        setForm({ name: '', role: '', area: '', email: '', phone: '', image: '' });
    };

    const openEdit = (m: ParishMember) => {
        setEditingId(m.id);
        setForm({ name: m.name, role: m.role, area: m.area, email: m.email, phone: m.phone, image: m.image || '' });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validationError = validateImageFile(file);
        if (validationError) { alert(validationError); e.target.value = ''; return; }
        if (file.size > 2 * 1024 * 1024) return alert('Image must be under 2MB.');


        // Compress via canvas to keep localStorage usage reasonable
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 300; // max dimension
                let w = img.width, h = img.height;
                if (w > h) { h = (h / w) * MAX; w = MAX; }
                else { w = (w / h) * MAX; h = MAX; }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                setForm(prev => ({ ...prev, image: dataUrl }));
            };
            img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const save = () => {
        if (!form.name || !form.role) return alert('Name and Role are required.');
        if (editingId === 0) {
            persist([...members, { id: nextId(members), ...form }]);
        } else {
            persist(members.map(m => m.id === editingId ? { ...m, ...form } : m));
        }
        setEditingId(null);
    };

    const deleteMember = (id: number) => {
        if (confirm('Delete this member?')) persist(members.filter(m => m.id !== id));
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
                    <h1>Parish Committee Members</h1>
                    <p>Manage committee members, their roles, photos, and contact details. ({members.length} members)</p>
                </div>
                <Button variant="primary" onClick={openAdd}>➕ Add Member</Button>
            </header>

            <Card className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Role / Designation</th>
                                <th>Area</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, idx) => (
                                <tr key={member.id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                                            />
                                        ) : (
                                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '2px solid var(--card-border)' }}>
                                                👤
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>{member.name}</td>
                                    <td>
                                        <span className={styles.badge} style={{ background: 'rgba(255, 215, 0, 0.15)', color: 'var(--color-gold)' }}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td>{member.area}</td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        {member.email && <div>{member.email}</div>}
                                        {member.phone && <div>{member.phone}</div>}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button variant="outline" onClick={() => openEdit(member)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</Button>
                                            <Button variant="secondary" onClick={() => deleteMember(member.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No committee members yet. Click &quot;Add Member&quot; to get started.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add / Edit Modal */}
            {editingId !== null && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '520px', background: 'var(--card-bg)', padding: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading-system)', color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
                            {editingId === 0 ? 'Add Committee Member' : 'Edit Member'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Image Upload */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        width: '80px', height: '80px', borderRadius: '50%',
                                        border: '2px dashed var(--accent-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                                        background: 'var(--input-bg)'
                                    }}
                                >
                                    {form.image ? (
                                        <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '1.5rem' }}>📷</span>
                                    )}
                                </div>
                                <div>
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                        Upload Photo
                                    </Button>
                                    {form.image && (
                                        <Button variant="secondary" onClick={() => setForm({ ...form, image: '' })} style={{ padding: '6px 12px', fontSize: '0.85rem', marginLeft: '8px' }}>
                                            Remove
                                        </Button>
                                    )}
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>Max 2MB, JPEG/PNG</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" style={inputStyle} />
                            <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Role / Designation * (e.g. Vicar, Secretary)" style={inputStyle} />
                            <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="Area / Ward (optional)" style={inputStyle} />
                            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email (optional)" type="email" style={inputStyle} />
                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" style={inputStyle} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button variant="primary" onClick={save}>Save Member</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
