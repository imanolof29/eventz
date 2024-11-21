import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";


@Injectable()
export class EmailService {

    constructor(
        private readonly mailerService: MailerService
    ) { }


    async sendEmail(email: string, name: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Bienvenida',
            template: 'welcome',
            context: {
                name,
                email: email,
                date: new Date()
            }
        })
    }

}