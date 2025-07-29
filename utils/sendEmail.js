const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendDonationConfirmationEmail({ to, name, amount, message }) {
  const email = {
    to,
    from: process.env.FROM_EMAIL,
    subject: 'Thank you for your donation!',
    html: `
      <h2>Dear ${name},</h2>
      <p>Thank you for your generous donation of ₹${amount}.</p>
      ${message ? `<p>Your message: "${message}"</p>` : ''}
      <p>Your support is greatly appreciated!</p>
    `,
  };

  try {
    await sgMail.send(email);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error.message);
  }
}

module.exports = { sendDonationConfirmationEmail };
