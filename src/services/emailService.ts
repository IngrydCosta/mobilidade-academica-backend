import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "thalis.mraz@gmail.com",
        pass: process.env.SMTP_PASS || "dootpetevnubagcm",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string, tempPassword: string): Promise<boolean> {
    try {
      const from = process.env.SMTP_FROM || `"Mobilidade Acadêmica" <${process.env.SMTP_USER}>`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #0C2445; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #173764; border-bottom: 3px solid #D9A95E; color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Sistema de Mobilidade Acadêmica</h2>
          </div>
          <div style="padding: 28px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-top: 0;">Olá, <strong>${name}</strong>!</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">Sua conta foi criada com sucesso na plataforma de Mobilidade Acadêmica.</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">Abaixo estão suas credenciais de acesso temporárias:</p>
            <div style="background-color: #F8FAFC; border-left: 4px solid #D9A95E; border-radius: 4px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #334155;"><strong>E-mail:</strong> ${to}</p>
              <p style="margin: 0; font-size: 14px; color: #334155;">
                <strong>Senha Temporária:</strong> 
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 16px; color: #173764; font-weight: bold; background-color: #EEF2F6; padding: 4px 8px; border-radius: 4px; border: 1px solid #CBD5E1; display: inline-block; margin-left: 6px;">${tempPassword}</span>
              </p>
            </div>
            <p style="color: #64748B; font-size: 13px; line-height: 1.4;">Recomendamos que você altere sua senha assim que realizar o primeiro login no sistema.</p>
          </div>
          <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px; text-align: center; font-size: 12px; color: #64748B;">
            <p style="margin: 0;">Plataforma de Mobilidade Acadêmica</p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from,
        to,
        subject: "Bem-vindo ao Sistema de Mobilidade Acadêmica - Sua Senha de Acesso",
        html: htmlContent,
      });

      console.log(`[E-mail Service] E-mail de boas-vindas enviado para: ${to}`);
      return true;
    } catch (error) {
      console.error("[E-mail Service Error] Falha ao enviar e-mail de boas-vindas:", error);
      return false;
    }
  }

  async sendPasswordResetEmail(to: string, name: string, tempPassword: string): Promise<boolean> {
    try {
      const from = process.env.SMTP_FROM || `"Mobilidade Acadêmica" <${process.env.SMTP_USER}>`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #0C2445; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #173764; border-bottom: 3px solid #D9A95E; color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Recuperação de Senha</h2>
          </div>
          <div style="padding: 28px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-top: 0;">Olá, <strong>${name}</strong>!</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">Recebemos uma solicitação de recuperação de senha para a sua conta no Sistema de Mobilidade Acadêmica.</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">Uma nova senha temporária foi gerada para você:</p>
            <div style="background-color: #F8FAFC; border-left: 4px solid #D9A95E; border-radius: 4px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #334155;"><strong>Sua Nova Senha Temporária:</strong></p>
              <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 18px; color: #173764; font-weight: bold; background-color: #EEF2F6; padding: 6px 12px; border-radius: 4px; border: 1px solid #CBD5E1; display: inline-block;">${tempPassword}</p>
            </div>
            <p style="color: #64748B; font-size: 13px; line-height: 1.4;">Utilize esta senha para entrar na plataforma e altere-a em seu perfil para a sua segurança.</p>
            <p style="color: #94A3B8; font-size: 12px; margin-top: 20px;">Se você não solicitou a alteração de senha, entre em contato com o administrador imediatamente.</p>
          </div>
          <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px; text-align: center; font-size: 12px; color: #64748B;">
            <p style="margin: 0;">Plataforma de Mobilidade Acadêmica</p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from,
        to,
        subject: "Recuperação de Senha - Sistema de Mobilidade Acadêmica",
        html: htmlContent,
      });

      console.log(`[E-mail Service] E-mail de recuperação enviado para: ${to}`);
      return true;
    } catch (error) {
      console.error("[E-mail Service Error] Falha ao enviar e-mail de recuperação de senha:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
