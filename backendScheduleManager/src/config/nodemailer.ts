import nodemailer from "nodemailer"
import { MailtrapTransport } from "mailtrap"
import dotenv from "dotenv"

dotenv.config({})

export const emailSender = {
    address: process.env.MAILTRAP_SENDER_EMAIL ?? "hello@demomailtrap.co",
    name: process.env.MAILTRAP_SENDER_NAME ?? "FaCyT Event Manager",
}

type AppMailOptions = {
    from: { address: string; name: string }
    to: string
    subject: string
    text: string
    html?: string
    category?: string
}

type AppTransporter = {
    sendMail(mailOptions: AppMailOptions): Promise<unknown>
}

export const transporter: AppTransporter = nodemailer.createTransport(
    MailtrapTransport({
        token: process.env.MAILTRAP_TOKEN ?? "",
    })
)
