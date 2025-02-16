import nodemailer from "nodemailer"
import  dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.APP_PASSWORD, 
    },
});

async function sendEmail(to, subject, text) {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📩 Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
}

export default sendEmail