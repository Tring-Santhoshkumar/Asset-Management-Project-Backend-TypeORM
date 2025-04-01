import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
    },
});

export async function sendEmail({ to, subject, text, html } : any) {
    const mailOptions = {from : process.env.EMAIL_USER as string, to, subject, text, html };
    try{
        await transporter.sendMail(mailOptions);
        console.log("Email Successfully sent to ",to);
    }
    catch(error) {
        console.error("Email Error : ",error);
        throw error;
    }
}

