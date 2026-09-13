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
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; rounded: 8px; overflow: hidden;">
          <div style="background-color: #0E284E; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Sistema de Mobilidade Acadêmica</h2>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p>Olá, <strong>${name}</strong>!</p>
            <p>Sua conta foi criada com sucesso na plataforma de Mobilidade Acadêmica.</p>
            <p>Abaixo estão suas credenciais de acesso temporárias:</p>
            <div style="background-color: #f4f6f8; border-left: 4px solid #0E284E; padding: 12px 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #555;"><strong>E-mail:</strong> ${to}</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #555;"><strong>Senha Temporária:</strong> <span style="font-family: monospace; font-size: 16px; color: #d9534f; font-weight: bold;">${tempPassword}</span></p>
            </div>
            <p style="color: #666; font-size: 14px;">Recomendamos que você altere sua senha assim que realizar o primeiro login no sistema.</p>
          </div>
          <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">OpenEu - Plataforma de Mobilidade Acadêmica</p>
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
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; rounded: 8px; overflow: hidden;">
          <div style="background-color: #0E284E; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Recuperação de Senha</h2>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p>Olá, <strong>${name}</strong>!</p>
            <p>Recebemos uma solicitação de recuperação de senha para a sua conta no Sistema de Mobilidade Acadêmica.</p>
            <p>Uma nova senha temporária foi gerada para você:</p>
            <div style="background-color: #f4f6f8; border-left: 4px solid #D3A969; padding: 12px 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #555;"><strong>Sua Nova Senha Temporária:</strong></p>
              <p style="margin: 8px 0 0 0; font-family: monospace; font-size: 18px; color: #0E284E; font-weight: bold;">${tempPassword}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Utilize esta senha para entrar na plataforma e altere-a em seu perfil para a sua segurança.</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">Se você não solicitou a alteração de senha, entre em contato com o administrador imediatamente.</p>
          </div>
          <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">OpenEu - Plataforma de Mobilidade Acadêmica</p>
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
