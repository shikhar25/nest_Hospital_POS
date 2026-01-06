import { SmsProvider } from '../interfaces/sms.interface';
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioSmsProvider implements SmsProvider {
    private client: Twilio;


    constructor() {
        const sid = process.env.TWILIO_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const secret = process.env.TWILIO_SECRET;

        if (!sid) {
            throw new Error('TWILIO_SID is missing in .env');
        }

        if (sid.startsWith('SK')) {
            // API Key mode
            if (!secret) {
                throw new Error('TWILIO_SECRET is required when using API Key SID');
            }
            this.client = new Twilio(sid, secret, { accountSid: process.env.TWILIO_ACCOUNT_SID });
        } else if (sid.startsWith('AC')) {
            // Account SID mode
            if (!token) {
                throw new Error('TWILIO_AUTH_TOKEN is required when using Account SID');
            }
            this.client = new Twilio(sid, token);
        } else {
            throw new Error('Invalid TWILIO_SID format. Must start with AC or SK');
        }
    }

    async sendSms(to: string, message: string): Promise<void> {
        await this.client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to.startsWith('+') ? to : `+91${to}`,
        });
    }
}
