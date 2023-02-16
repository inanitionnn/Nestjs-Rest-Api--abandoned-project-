import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  public sendMaile(email, link): void {
    this.mailerService.sendMail({
      to: email, // List of receivers email address
      from: process.env.SMTP_USER, // Senders email address
      subject: 'Account activation on the site ' + process.env.API_URL, // Subject line
      text: '', // plaintext body
      html: `
          <div>
            <h1>link to activate account</h1>
            <hr>
            <h2><a href="${link}">${link}1</a><h2>
            <hr>
          </div>
        `, // HTML body content
    });
  }
}
