const nodemailer = require('nodemailer');

const sendEmail = async (orderDetails, userEmail) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp://live.smtp.mailtrap.io', // Replace with your SMTP server
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'mailtrap@demomailtrap.com', // Replace with your email
            pass: '66e0de37967140fbd41287a1d3d89272', // Replace with your email password
        },
    });

    const { orderNumber, items } = orderDetails;

    const emailContent = `
        <h1>Thank You for Your Purchase!</h1>
        <h2>Order Confirmed</h2>
        <p>Your order number is <strong>${orderNumber}</strong>.</p>
        <p>A confirmation email has been sent to you.</p>
        <h3>Order Summary</h3>
        <ul>
            ${items.map(item => `
                <li>
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity}<br>
                    Price: ${item.price} points
                </li>
            `).join('')}
        </ul>
    `;

    let info = await transporter.sendMail({
        from: '"Your Store" <mailtrap@demomailtrap.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Order Confirmation", // Subject line
        html: emailContent, // html body
    });

    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
