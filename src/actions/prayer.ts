'use server';

import { prisma } from '@/lib/prisma';
import { prayerRequestSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

export async function submitPrayerRequest(data: z.infer<typeof prayerRequestSchema>) {
    try {
        // 1. Validate data on the server
        const parsedData = prayerRequestSchema.parse(data);

        // 2. Insert into the database
        const request = await prisma.prayerRequest.create({
            data: {
                requester_name: parsedData.requester_name,
                target_name: parsedData.target_name,
                age: parsedData.age,
                email: parsedData.email,
                phone: parsedData.phone,
                date: new Date(parsedData.date),
                category: parsedData.category,
                reason: parsedData.reason,
                notes: parsedData.notes,
            },
        });

        // 3. Send confirmation email to user
        const emailHtml = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f7f4ed; padding: 20px; text-align: center; border-bottom: 3px solid #FFC72C;">
          <h2 style="margin: 0; font-family: serif;">St. Mary's Malankara Orthodox Syrian Church</h2>
          <p style="margin: 5px 0 0; color: #666;">New Prayer Request</p>
          </div>
        <div style="padding: 30px; background-color: #F8F5EE;">
          <p>Dear ${parsedData.requester_name},</p>
          <p>We have successfully received your prayer request for <strong>${parsedData.target_name}</strong>.</p>
          <p><strong>Category:</strong> ${parsedData.category}</p>
          <p><strong>Date Requested:</strong> ${parsedData.date}</p>
          <p>The parish community will remember your intentions during the Holy Qurbono.</p>
          <br/>
          <p>May God bless you,</p>
          <p><strong>Vicar & Committee</strong><br/>St. Mary's Muthupilakkadu</p>
        </div>
      </div>
    `;

        // Fire and forget email async (log error if fails but don't crash request)
        sendEmail({
            to: parsedData.email,
            subject: 'Prayer Request Confirmation - St. Mary\'s Church',
            html: emailHtml,
        }).catch(e => console.error("Email sending failed:", e));

        return { success: true, id: request.id };

    } catch (error) {
        console.error('Submission Error:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'Invalid formulation data.' };
        }
        return { success: false, error: 'Failed to submit the prayer request. Please try again later.' };
    }
}
