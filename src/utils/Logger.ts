import * as vscode from 'vscode';

export class Logger {
  private static outputChannel: vscode.OutputChannel | null = null;
  private static isDebug = false;

  public static initialize(channelName = 'VS Code Pet', debug = false): void {
    if (!this.outputChannel) {
      this.outputChannel = vscode.window.createOutputChannel(channelName);
    }
    this.isDebug = debug;
  }

  public static info(message: string, context?: Record<string, unknown>): void {
    this.log('INFO', message, context);
  }

  public static warn(message: string, context?: Record<string, unknown>): void {
    this.log('WARN', message, context);
  }

  public static error(message: string, error?: unknown): void {
    let errorDetail = '';
    if (error instanceof Error) {
      errorDetail = `: ${error.message}`;
    } else if (error) {
      errorDetail = `: ${String(error)}`;
    }
    this.log('ERROR', `${message}${errorDetail}`);
  }

  public static debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDebug) {
      this.log('DEBUG', message, context);
    }
  }

  private static log(level: string, message: string, context?: Record<string, unknown>): void {
    // Sanitize message to never leak secrets/tokens
    const sanitized = this.sanitize(message);
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${this.sanitize(JSON.stringify(context))}` : '';
    const formatted = `[${timestamp}] [${level}] ${sanitized}${contextStr}`;

    if (this.outputChannel) {
      this.outputChannel.appendLine(formatted);
    }
  }

  private static sanitize(input: string): string {
    return input
      .replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer ***')
      .replace(/token[=:]\s*["']?[a-zA-Z0-9_\-\.]+["']?/gi, 'token=***')
      .replace(/password[=:]\s*["']?[^"'\s]+["']?/gi, 'password=***');
  }

  public static dispose(): void {
    if (this.outputChannel) {
      this.outputChannel.dispose();
      this.outputChannel = null;
    }
  }
}
