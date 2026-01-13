export interface EmailProvider {
    sendEmail(to: string, subject: string, message: string): Promise<void>;
}