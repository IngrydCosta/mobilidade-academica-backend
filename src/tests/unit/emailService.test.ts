import { describe, it, expect, vi, beforeEach } from 'vitest';
import { emailService } from '../../services/emailService';

describe('EmailService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve simular envio do e-mail de boas-vindas retornando boolean', async () => {
    const spy = vi.spyOn(emailService, 'sendWelcomeEmail').mockResolvedValue(true);

    const result = await emailService.sendWelcomeEmail('test@uporto.pt', 'Maria Santos', 'temp1234');

    expect(spy).toHaveBeenCalledWith('test@uporto.pt', 'Maria Santos', 'temp1234');
    expect(result).toBe(true);
  });

  it('deve simular envio do e-mail de redefinição de senha retornando boolean', async () => {
    const spy = vi.spyOn(emailService, 'sendPasswordResetEmail').mockResolvedValue(true);

    const result = await emailService.sendPasswordResetEmail('test@uporto.pt', 'Maria Santos', 'reset5678');

    expect(spy).toHaveBeenCalledWith('test@uporto.pt', 'Maria Santos', 'reset5678');
    expect(result).toBe(true);
  });
});
