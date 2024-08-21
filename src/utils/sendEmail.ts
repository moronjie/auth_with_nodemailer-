import nodemailer from 'nodemailer'


export const sendEmail = async (email: string, subject: string, text: string) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS, 
        },
    });

    const message = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: `<h1>Welcome!</h1><p>${text}</p>`
    }

    await transporter.sendMail(message)
}