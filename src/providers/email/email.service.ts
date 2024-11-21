import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailDto } from "./mail.dto";
import { createTransport } from 'nodemailer';
import * as Mail from "nodemailer/lib/mailer"
import * as path from 'path';
import * as hbs from 'nodemailer-express-handlebars';


@Injectable()
export class EmailService {

    constructor(
        private readonly configService: ConfigService
    ) { }

    mailTransport() {
        const transporter = createTransport({
            host: this.configService.get<string>("MAIL_HOST"),
            port: this.configService.get<number>("MAIL_PORT"),
            secure: false,
            auth: {
                user: this.configService.get<string>("MAIL_USERNAME"),
                pass: this.configService.get<string>("MAIL_PASSWORD")
            },
            debug: true
        })

        const handlebarOptions = {
            viewEngine: {
                extname: '.hbs',
                partialsDir: path.resolve('./templates/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./templates/'),
            extName: '.hbs',
        };

        transporter.use('compile', hbs(handlebarOptions))

        return transporter
    }

    async sendEmail(dto: MailDto) {
        const { from, recipients, html, text, subject } = dto

        const transporter = this.mailTransport()

        const options = {
            from: from ?? {
                name: '',
                address: ''
            },
            to: recipients,
            subject,
            template: 'welcome',
            context: { name: dto.name, email: 'imanolof29@gmail.com', date: new Date() }
        }

        try {
            const result = await transporter.sendMail(options)
            return result
        } catch (e) {
            console.log(e)
        }

    }

}