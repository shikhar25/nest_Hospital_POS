import { Module } from '@nestjs/common';
import { SmsService } from './services/sms.service';
import { TwilioSmsProvider } from './provider/twilio.provider';
import { EmailService } from './services/email.service';
import { NodemailerProvider } from './provider/nodemailer.provider';

@Module({
  providers: [
    SmsService,
    {
      provide: 'SMS_PROVIDER',
      useClass: TwilioSmsProvider,
    },
    EmailService,
    {
      provide: 'EMAIL_PROVIDER',
      useClass: NodemailerProvider,
    },
  ],
  exports: [SmsService, EmailService],
})
export class CommonModule {}