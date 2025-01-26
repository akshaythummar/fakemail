interface Env {
    MAIL_DB: D1Database;
}

interface EmailData {
    mail_id: number;
    user_id: string;
    message_id: string;
    subject: string;
    sender: string;
    senderName: string;
    recipient: string;
    content_type: string;
    body_text: string;
    body_html: string;
    received_at: string;
    cc: string;
    bcc: string;
}

const insertMails = async (emailData: EmailData, env: Env) => {
    try {
        // 1. insert emails table
        const emailResult = await env.MAIL_DB.prepare(`
            INSERT INTO emails (message_id, user_email_id, subject, sender, sender_name, recipient, content_type, body_text, body_html, received_at, cc, bcc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            emailData.message_id,
            emailData.mail_id,
            emailData.subject,
            emailData.sender,
            emailData.senderName,
            emailData.recipient,
            emailData.content_type,
            emailData.body_text,
            emailData.body_html,
            emailData.received_at,
            emailData.cc,
            emailData.bcc
        ).run();

        // 2. get email_id
        const emailId = emailResult.meta.last_row_id;

        // 3. insert email_status table
        await env.MAIL_DB.prepare(`
            INSERT INTO email_status (email_id, user_id, is_read, is_starred, is_archived) VALUES (?, ?, 0, 0, 0)
        `).bind(emailId, emailData.user_id).run();

        return { success: true, emailId };
    } catch (error) {
        console.error('Failed to insert email:', error);
    }
};

export default insertMails;