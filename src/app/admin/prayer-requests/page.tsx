'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getPrayerRequests, savePrayerRequests, type PrayerRequest } from '@/lib/store';
import styles from '@/styles/AdminDataTable.module.css';

export default function PrayerRequestsManager() {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);

    useEffect(() => { setRequests(getPrayerRequests()); }, []);

    const persist = (updated: PrayerRequest[]) => {
        setRequests(updated);
        savePrayerRequests(updated);
    };

    const handleExportXLSX = () => {
        try {
            const exportData = requests.map(r => ({
                ID: r.id,
                Requester: r.requester_name,
                'Prayed For': r.target_name,
                Category: r.category,
                Date: r.date,
                Status: r.status,
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Prayer Requests');
            // Use write() + Blob to guarantee browser download
            const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
            const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Prayer_Requests_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Export Excel failed. Please try again.');
            console.error(err);
        }
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Prayer Requests Report", 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableData = requests.map(r => [
                `#${r.id}`, r.requester_name, r.target_name, r.category, r.date, r.status
            ]);

            autoTable(doc, {
                startY: 40,
                head: [['ID', 'Requester', 'Prayed For', 'Category', 'Date', 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [139, 26, 26] }, // Crimson brand color
            });

            doc.save(`Prayer_Requests_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            alert('Export PDF failed. Please try again.');
            console.error(err);
        }
    };

    const markCompleted = (id: number) => {
        persist(requests.map(req => req.id === id ? { ...req, status: 'COMPLETED' } : req));
    };

    const deleteRequest = (id: number) => {
        if (confirm('Delete this prayer request?')) {
            persist(requests.filter(r => r.id !== id));
        }
    };

    return (
        <div className={styles.managerContainer}>
            <header className={styles.header}>
                <div>
                    <h1>Prayer Requests</h1>
                    <p>Manage and export incoming prayer requests. ({requests.length} total)</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button variant="outline" onClick={handleExportPDF}>
                        📄 Export PDF
                    </Button>
                    <Button variant="primary" onClick={handleExportXLSX}>
                        📥 Export Excel
                    </Button>
                </div>
            </header>

            <Card className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Requester</th>
                                <th>Target Person</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id}>
                                    <td>#{req.id}</td>
                                    <td>{req.requester_name}</td>
                                    <td>{req.target_name}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[req.category.toLowerCase()] || ''}`}>
                                            {req.category}
                                        </span>
                                    </td>
                                    <td>{req.date}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${req.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {req.status === 'PENDING' && (
                                                <Button variant="outline" onClick={() => markCompleted(req.id)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                    ✅ Done
                                                </Button>
                                            )}
                                            <Button variant="secondary" onClick={() => deleteRequest(req.id)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                                                🗑️
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No prayer requests.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
