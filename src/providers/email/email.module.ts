import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigModule } from "@nestjs/config";

//Configurar el mailer module aqui para aislar el modulo a este modulo y que no este a nivel global.
//Darle una vuelta a esto

@Module({
    imports: [ConfigModule],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }