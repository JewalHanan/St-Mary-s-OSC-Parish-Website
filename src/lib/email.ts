import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

type SendEmailParams = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

export const sendEmail = async ({ to, subject, text, html }: SendEmailParams) => {
    if (!process.env.SMTP_USER) {
        console.warn('SMTP credentials not configured. Skipping email send.');
        return;
    }

    const mailOptions = {
        from: `"St. Mary's Church" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
