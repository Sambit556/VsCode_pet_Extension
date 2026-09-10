import * as vscode from 'vscode';
import { IExtensionConfig, PetTheme, PetSize } from '../pets/PetTypes';

export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private changeEmitter = new vscode.EventEmitter<IExtensionConfig>();
  public readonly onDidChangeConfiguration = this.changeEmitter.event;

  private constructor() {}

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  public register(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('vscodePet')) {
          this.changeEmitter.fire(this.getConfig());
        }
      }),
      this.changeEmitter
    );
  }

  public getConfig(): IExtensionConfig {
    const config = vscode.workspace.getConfiguration('vscodePet');
    return {
      petSize: config.get<PetSize>('petSize', 'small'),
      petSpeed: config.get<'slow' | 'normal' | 'fast'>('petSpeed', 'normal'),
      theme: config.get<PetTheme>('theme', 'none'),
      allowClimbing: config.get<boolean>('allowClimbing', true),
      sound: config.get<boolean>('sound', false),
      developerReactions: config.get<boolean>('developerReactions', true)
    };
  }
}
