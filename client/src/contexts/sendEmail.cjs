const nodemailer = require('nodemailer');

const sendEmail = async (orderDetails, userEmail) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'masatotahir@gmail.com', // Replace with your email
            pass: 'tcvlbsuyyhvmkvvc', // Replace with your email password
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
        from: '"Eco Unity" <masatotahir@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Order Confirmation", // Subject line
        html: emailContent, // html body
    });

    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
