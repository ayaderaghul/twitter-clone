const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // hoặc dịch vụ SMTP khác
      port: 587,
      secure: false, // true cho port 465
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Twitter Clone" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`📤 Email đã gửi đến ${to}`);
  } catch (error) {
    console.error('🚨 Email error:', error);
    throw new Error('Không thể gửi email');
  }
};

module.exports = sendEmail;
