import * as vscode from 'vscode';
import { Logger } from '../utils/Logger';

export class TelemetryManager {
  private static instance: TelemetryManager;

  private constructor() {}

  public static getInstance(): TelemetryManager {
    if (!TelemetryManager.instance) {
      TelemetryManager.instance = new TelemetryManager();
    }
    return TelemetryManager.instance;
  }

  public sendEvent(eventName: string, properties?: Record<string, string | number | boolean>): void {
    if (!vscode.env.isTelemetryEnabled) {
      return;
    }

    try {
      Logger.debug(`[Telemetry] ${eventName}`, properties);
    } catch {
      // Ignored
    }
  }
}
