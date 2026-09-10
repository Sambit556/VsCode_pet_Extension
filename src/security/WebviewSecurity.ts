import * as crypto from 'crypto';
import * as vscode from 'vscode';

export class WebviewSecurity {
  /**
   * Generates a cryptographically random 32-character nonce
   */
  public static generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generates an authentication token for API security
   */
  public static generateAuthToken(): string {
    return crypto.randomBytes(24).toString('hex');
  }

  /**
   * Generates strict Content Security Policy for the Pet Webview
   */
  public static getCSP(
    webview: vscode.Webview,
    _extensionUri: vscode.Uri,
    nonce: string,
    backendPort?: number
  ): string {
    const cspSource = webview.cspSource;
    const connectSources = [
      cspSource,
      'http://127.0.0.1:*',
      'http://localhost:*',
      'ws://127.0.0.1:*',
      'ws://localhost:*'
    ];
    if (backendPort) {
      connectSources.push(`http://127.0.0.1:${backendPort}`, `http://localhost:${backendPort}`);
    }

    return [
      `default-src 'none'`,
      `img-src ${cspSource} data: blob: https:`,
      `media-src ${cspSource} data: blob:`,
      `style-src ${cspSource} 'unsafe-inline'`,
      `script-src 'nonce-${nonce}'`,
      `font-src ${cspSource}`,
      `connect-src ${connectSources.join(' ')}`
    ].join('; ');
  }

  /**
   * Validates strings such as pet names, commands, and IDs
   */
  public static sanitizeString(input: unknown, maxLength = 50): string {
    if (typeof input !== 'string') {
      return '';
    }
    // Strip control characters, html tags
    const cleaned = input.replace(/[<>'"&]/g, '').trim();
    return cleaned.slice(0, maxLength);
  }

  /**
   * Validate that incoming webview message has a safe shape
   */
  public static validateWebviewMessage(message: unknown): { command: string; payload?: any } | null {
    if (!message || typeof message !== 'object') {
      return null;
    }
    const msg = message as Record<string, unknown>;
    if (typeof msg.command !== 'string') {
      return null;
    }
    const validCommands = [
      'webviewReady',
      'petAction',
      'addPet',
      'removePet',
      'renamePet',
      'throwBall',
      'changeTheme',
      'openSettings',
      'playSound',
      'log'
    ];
    if (!validCommands.includes(msg.command)) {
      return null;
    }
    return {
      command: msg.command,
      payload: msg.payload
    };
  }
}
