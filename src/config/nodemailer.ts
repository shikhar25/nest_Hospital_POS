// // import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// // import db from '../IndexFiles/modelsIndex';

// // const Announcement = db.announcement;

// /**
//  * Mail data can be:
//  * - number (email id)
//  * - Sequelize model instance
//  */
// type MailData =
//   | number
//   | (Model & {
//       dataValues?: {
//         email_id?: string;
//       };
//     });

// export const mailsend = async (
//   body: SendMailOptions,
//   mail_data?: MailData
// ): Promise<boolean | nodemailer.SentMessageInfo> => {
//   const transporter: Transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//       user: process.env.SMTP_USER, // 🔐 moved to env
//       pass: process.env.SMTP_PASS,
//     },
//     logger: true,
//     debug: process.env.SMTP_DEBUG === 'true',
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   let email_detail: string | number | undefined;

//   if (typeof mail_data === 'number') {
//     email_detail = mail_data;
//   } else if (mail_data?.dataValues?.email_id) {
//     email_detail = mail_data.dataValues.email_id;
//   }

//   if (email_detail) {
//     const announceData = await Announcement.findOne({
//       where: { email_id: email_detail },
//     });

//     if (announceData?.dataValues?.email_id) {
//       await Announcement.update(
//         { email_status: 'send' },
//         {
//           where: { email_id: announceData.dataValues.email_id },
//         }
//       );
//     }
//   }

//   try {
//     const mailInfo = await transporter.sendMail(body);

//     console.log('Message sent successfully!');
//     return mailInfo;
//   } catch (error) {
//     console.error('Error occurred while sending mail', error);
//     return false;
//   }
// };
