const nodemailer = require('nodemailer');

async function sendMail(toArr, subject, html, text) {
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_SMTP_SERVER,
        port: process.env.MAIL_SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_SMTP_USER, // generated ethereal user
            pass: process.env.MAIL_SMTP_PASSWORD // generated ethereal password
        }
    });
    const mailData = {
        from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDR}>`,
        to: toArr.join(','),
        subject: subject
    };
    if(html) mailData.html = html;
    else if(text) mailData.text = text;
    let info = await transporter.sendMail(mailData);
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
async function sendForgotMail(toArr, resetUrl, token) {
    const html = `<h3>Reset password at ${process.env.APP_NAME}</h3>
    <p>Dear,</p><p>We recently receive your request to reset password. If it was you, please click this link below to continue, it only be available for 24 hours from now. Otherwise simply ignore this email.</p>
    <p><a href="${resetUrl}/${token}">Reset</a></p><p>Best regards,</p><p>${process.env.APP_NAME}</p>`;
    return await sendMail(toArr, '[Forgot] Your password reset request', html);
}
export default {
    sendMail, sendForgotMail
}