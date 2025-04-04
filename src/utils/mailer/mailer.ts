import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface MailType{
    to : string
    subject : string
    html: string
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
    },
});

export async function sendEmail({ to, subject, html } : MailType) {
    const mailOptions = {from : process.env.EMAIL_USER as string, to, subject, html };
    try{
        await transporter.sendMail(mailOptions);
        console.log("Email Successfully sent to ",to);
    }
    catch(error) {
        console.error("Email Error : ",error);
        throw error;
    }
}

