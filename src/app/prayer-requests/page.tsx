'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { prayerRequestSchema } from '@/lib/validations';
import { submitPrayerRequest } from '@/actions/prayer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from '@/styles/PrayerRequest.module.css';

type FormData = {
    requester_name: string;
    target_name: string;
    age?: number;
    email: string;
    phone?: string;
    date: string;
    category: 'BLESSINGS' | 'DEPARTED' | 'SICK' | 'BIRTHDAY' | 'ANNIVERSARY' | 'OTHER';
    reason?: string;
    notes?: string;
    consent: boolean;
    recaptchaToken: string;
};

export default function PrayerRequestPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(prayerRequestSchema),
        defaultValues: {
            recaptchaToken: 'dummy-token-for-now' // In production, integrate actual reCAPTCHA
        }
    });

    const watchCategory = watch('category');

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const result = await submitPrayerRequest(data);
            if (result.success) {
                setSuccess(true);
            } else {
                alert(result.error);
            }
        } catch (e) {
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.successMessage}>
                    <h2>Prayer Request Submitted</h2>
                    <p>Your request has been received. A confirmation email has been sent.</p>
                    <Button onClick={() => setSuccess(false)}>Submit Another</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1>Submit a Prayer Request</h1>
                <p>Allow our parish to pray for your intentions during the Holy Qurbono.</p>
            </div>

            <Card className={styles.formCard}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                    <div className={styles.formGroup}>
                        <label>Category *</label>
                        <div className={styles.radioGroup}>
                            {['BLESSINGS', 'DEPARTED', 'SICK', 'BIRTHDAY', 'ANNIVERSARY', 'OTHER'].map(cat => (
                                <label key={cat} className={styles.radioLabel}>
                                    <input type="radio" value={cat} {...register('category')} />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>
                        {errors.category && <p className={styles.error}>{errors.category.message}</p>}
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Name of the person being prayed for *</label>
                            <input type="text" {...register('target_name')} className={styles.input} />
                            {errors.target_name && <p className={styles.error}>{errors.target_name.message}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Age (Optional)</label>
                            <input type="number" {...register('age', { valueAsNumber: true })} className={styles.input} />
                            {errors.age && <p className={styles.error}>{errors.age.message}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Your Name *</label>
                            <input type="text" {...register('requester_name')} className={styles.input} />
                            {errors.requester_name && <p className={styles.error}>{errors.requester_name.message}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Your Email *</label>
                            <input type="email" {...register('email')} className={styles.input} />
                            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Preferred Date *</label>
                            <input type="date" {...register('date')} className={styles.input} />
                            {errors.date && <p className={styles.error}>{errors.date.message}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Phone Number (Optional)</label>
                            <input type="tel" {...register('phone')} className={styles.input} />
                        </div>
                    </div>

                    {watchCategory === 'OTHER' && (
                        <div className={styles.formGroup}>
                            <label>Specific Reason *</label>
                            <input type="text" {...register('reason')} className={styles.input} />
                            {errors.reason && <p className={styles.error}>{errors.reason.message}</p>}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Additional Notes</label>
                        <textarea {...register('notes')} className={styles.textarea} rows={4}></textarea>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="consent" {...register('consent')} />
                        <label htmlFor="consent">I confirm the details above are accurate</label>
                        {errors.consent && <p className={styles.error}>{errors.consent.message}</p>}
                    </div>

                    <Button type="submit" disabled={isSubmitting} style={{ width: 'auto', minWidth: '200px', maxWidth: '280px', margin: '0 auto', display: 'block', borderRadius: '12px', fontFamily: "'Poppins', sans-serif" }}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>

                    <p className={styles.captchaNote}>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
                </form>
            </Card>
        </div>
    );
}
