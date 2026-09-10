import { describe, it, expect } from 'vitest';
import { WebviewSecurity } from '../src/security/WebviewSecurity';

describe('WebviewSecurity', () => {
  it('generates secure 32-character hex nonce', () => {
    const nonce1 = WebviewSecurity.generateNonce();
    const nonce2 = WebviewSecurity.generateNonce();

    expect(nonce1).toHaveLength(32);
    expect(nonce2).toHaveLength(32);
    expect(nonce1).not.toBe(nonce2);
  });

  it('generates high-entropy auth token', () => {
    const token = WebviewSecurity.generateAuthToken();
    expect(token).toHaveLength(48);
  });

  it('sanitizes strings and strips script/html injection', () => {
    const malicious = '<script>alert("xss")</script>Luna';
    const cleaned = WebviewSecurity.sanitizeString(malicious, 30);
    expect(cleaned).not.toContain('<');
    expect(cleaned).not.toContain('>');
    expect(cleaned).not.toContain('"');
    expect(cleaned).toBe('scriptalert(xss)/scriptLuna');
  });

  it('validates safe webview message structure', () => {
    const valid = WebviewSecurity.validateWebviewMessage({ command: 'feedPet', payload: { petId: '123' } });
    const invalid = WebviewSecurity.validateWebviewMessage({ command: '__proto__pollute' });
    const nonObject = WebviewSecurity.validateWebviewMessage('malicious_string');

    expect(invalid).toBeNull();
    expect(nonObject).toBeNull();
  });
});
