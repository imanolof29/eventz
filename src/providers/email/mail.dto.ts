import { Address } from 'nodemailer/lib/mailer'

export interface MailDto {
    from: Address
    recipients: Address
    subject: string
    html: string
    text?: string
    name: string
}