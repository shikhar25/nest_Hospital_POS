import { Injectable, Inject } from '@nestjs/common';
import type { EmailProvider } from '../interfaces/email.interface';

@Injectable()
export class EmailService {
  constructor(@Inject('EMAIL_PROVIDER') private readonly provider: EmailProvider) {}

  async sendOtp(email: string, otp: string) {
    const subject = 'OTP Verification';
    const message = `Your OTP is ${otp}. Valid for 5 minutes.`;
    await this.provider.sendEmail(email, subject, message);
  }
}