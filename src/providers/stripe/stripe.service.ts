import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private stripe: Stripe
    constructor(
        private readonly configService: ConfigService
    ) {
        this.stripe = new Stripe(
            this.configService.getOrThrow('STRIPE_SECRET_API_KEY')
        )
    }

    async paymentIntent(amount: number, currency: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount,
                currency,
            })
            return { clientSecret: paymentIntent.client_secret }
        } catch (error) {
            console.log(error)
            throw new BadRequestException("Algo salio mal")
        }
    }

}