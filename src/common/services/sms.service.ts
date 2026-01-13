import { Injectable, Inject } from '@nestjs/common';
import type { SmsProvider } from '../interfaces/sms.interface';

@Injectable()
export class SmsService {
  constructor(@Inject('SMS_PROVIDER') private readonly provider: SmsProvider) {}

  async sendOtp(mobile: string, otp: string) {
    const message = `Your OTP is ${otp}. Valid for 5 minutes.`;
    await this.provider.sendSms(mobile, message);
  }
}
