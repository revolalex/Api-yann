const nodemailer = require('nodemailer');
const getMailTemplate = require('../modules/templateMail')
require('dotenv').config();

const mailRouter = async function (app) {
    await app.post("/mail/", function (req, res) {
        const subject = req.body.subject
        const message = req.body.message
        const name = req.body.name
        const email = req.body.email
        //gmail acces
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        // Mail object
        const mailOptions = {
            from: email,
            name: name,
            to: process.env.GMAIL_DEST,
            subject: subject,
            html: getMailTemplate.emailTemplate(name, email, subject, message)
        };
        // send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send('error sending email')
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('email sent')
            }
        });
    })
}
module.exports = mailRouter;


