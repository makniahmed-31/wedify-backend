import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>("SMTP_HOST");
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>("SMTP_PORT", 587),
        secure: config.get<boolean>("SMTP_SECURE", false),
        auth: {
          user: config.get<string>("SMTP_USER"),
          pass: config.get<string>("SMTP_PASS"),
        },
      });
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const from = this.config.get<string>("SMTP_FROM", "no-reply@wedify.tn");
    if (!this.transporter) {
      this.logger.warn(
        `[SMTP not configured] To: ${to} | Subject: ${subject}`,
      );
      return;
    }
    await this.transporter.sendMail({ from, to, subject, html });
  }
}
