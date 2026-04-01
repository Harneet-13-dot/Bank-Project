require('dotenv').config();
const nodemailer = require('nodemailer');
//transporter will communicate with smt server of google
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// module.exports = transporter;

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistrationEmail(userEmail, name) {
  const subject = "🎉 Welcome to PayFlow";

  const text = `
Hello ${name},

Welcome to PayFlow!

We're excited to have you on board. You can now send and request money securely.

Regards,
PayFlow Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
    
    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
      
      <h2 style="color: #2563eb;">🎉 Welcome to PayFlow</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>We're excited to have you onboard 🚀</p>

      <p>You can now send and request money securely using PayFlow.</p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 14px; color: #6b7280;">
        Regards,<br/>
        <strong>PayFlow Team</strong>
      </p>

    </div>

  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "💸 Payment Successful";

  const text = `
Hello ${name},

Your payment of ₹${amount} has been successfully sent.

Recipient Account: ${toAccount}

If you did not perform this transaction, please contact support immediately.

Regards,
PayFlow Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
    
    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
      
      <h2 style="color: #16a34a;">💸 Payment Successful</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>Your payment has been successfully processed.</p>

      <div style="margin: 15px 0; padding: 15px; background: #f3f4f6; border-radius: 8px;">
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Recipient Account:</strong> ${toAccount}</p>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        If you did not perform this transaction, please contact support immediately.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 14px; color: #6b7280;">
        Regards,<br/>
        <strong>PayFlow Team</strong>
      </p>

    </div>

  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionFailedEmail(userEmail, name, amount, toAccount) {
  const subject = "❌ Payment Failed";

  const text = `
Hello ${name},

Your payment of ₹${amount} could not be processed.

Recipient Account: ${toAccount}

Please try again or check your balance.

Regards,
PayFlow Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
    
    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
      
      <h2 style="color: #dc2626;">❌ Payment Failed</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>Your payment could not be processed.</p>

      <div style="margin: 15px 0; padding: 15px; background: #fef2f2; border-radius: 8px;">
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Recipient Account:</strong> ${toAccount}</p>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        Please check your balance or try again later.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 14px; color: #6b7280;">
        Regards,<br/>
        <strong>PayFlow Team</strong>
      </p>

    </div>

  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,sendTransactionEmail,sendTransactionFailedEmail
};