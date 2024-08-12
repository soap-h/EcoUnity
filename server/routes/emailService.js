const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendReceiptEmail = async ({ to, subject, items, totalAmount, paymentMethod, receiptNumber, datePaid }) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.OUTLOOK_EMAIL,
                pass: process.env.OUTLOOK_PASSWORD,
            },
        });

        const emailTemplate = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
                <div style="background-color: #036763; padding: 10px; border-radius: 8px 8px 0 0; text-align: center;">
                    <img src="cid:logo" alt="Company Logo" style="width: 100px;"/>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #333;">Thank you for registering!</h2>
                    <p>Receipt #: ${receiptNumber}</p>
                    <p>Date Paid: ${datePaid}</p>
                    <p>Payment Method: ${paymentMethod}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <h3>Summary</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${items.map(item => `<li style="margin: 10px 0;">Event: ${item.name}  - $${item.price.toFixed(2)}</li>`).join('')}
                    </ul>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 1.2em; font-weight: bold;">Amount Charged: $${totalAmount.toFixed(2)}</p>
                </div>
            </div>
        `;

        const logoPath = path.join(__dirname, './Eco Unity.png'); // Adjust the path
        const logoImage = fs.readFileSync(logoPath);

        let info = await transporter.sendMail({
            from: `"EcoUnity" <${process.env.OUTLOOK_EMAIL}>`,
            to: to,
            subject: subject,
            html: emailTemplate,
            attachments: [{
                filename: 'logo.png',
                content: logoImage,
                cid: 'logo'
            }]
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending receipt email:', error);
        throw new Error('Failed to send receipt email');
    }
};

module.exports = { sendReceiptEmail };
