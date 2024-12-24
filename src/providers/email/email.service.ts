import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ERROR_SENDING_EMAIL, INSUFFICIENT_DATA } from "src/errors/errors.constants";

type EmailTemplate = 'welcome' | 'reset-password' | 'verify-email';

export interface EmailTemplateParams {
    'welcome': { name: string; email: string; date: Date };
    'reset-password': { name: string; resetLink: string };
    'verify-email': { name: string; email: string };
}

@Injectable()
export class EmailService {

    constructor(private readonly mailerService: MailerService) { }

    async sendMail<T extends EmailTemplate>(
        email: string,
        template: T,
        params: EmailTemplateParams[T],
    ): Promise<void> {
        if (!email || !template || !params) {
            throw new BadRequestException(INSUFFICIENT_DATA);
        }

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: this.getSubjectForTemplate(template),
                template,
                context: params,
            });

        } catch (error) {
            throw new InternalServerErrorException(ERROR_SENDING_EMAIL);
        }
    }

    private getSubjectForTemplate(template: EmailTemplate): string {
        const subjects: Record<EmailTemplate, string> = {
            'welcome': '¡Bienvenido/a a nuestra plataforma!',
            'reset-password': 'Restablece tu contraseña',
            'verify-email': 'Por favor verifica tu email',
        };

        return subjects[template] || 'Asunto no especificado';
    }
}