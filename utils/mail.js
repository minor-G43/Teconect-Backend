const nodemailer = require('nodemailer');

const Mail = async options => {
    const option = {
        host: "smtp.gmail.com",
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        port: 587
    }
    const transporter = nodemailer.createTransport(option);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}

module.exports = Mail;