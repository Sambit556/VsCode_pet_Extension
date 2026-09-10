import * as vscode from 'vscode';
import { PetManager } from './pets/PetManager';
import { PetStorage } from './storage/PetStorage';
import { BackendServer } from './backend/server';
import { ConfigurationManager } from './configuration/ConfigurationManager';
import { DeveloperReactions } from './developer/DeveloperReactions';
import { PetWebviewViewProvider } from './views/PetWebviewViewProvider';
import { WebviewSecurity } from './security/WebviewSecurity';
import { Logger } from './utils/Logger';

// Commands
import { addPetCommand } from './commands/addPet';
import { removePetCommand } from './commands/managePet';
import {
  feedPetCommand,
  throwBallCommand,
  resetPetsCommand,
  openSettingsCommand
} from './commands/interactionCommands';
import { changeThemeCommand } from './commands/themeAndExportCommands';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    Logger.initialize('VS Code Pet', false);
    Logger.info('Activating VS Code Pet extension...');

    const configManager = ConfigurationManager.getInstance();
    configManager.register(context);

    const storage = new PetStorage(context.globalState);
    const petManager = PetManager.getInstance();
    petManager.initialize(storage);
    context.subscriptions.push({ dispose: () => petManager.dispose() });

    // Internal Express Server
    const authToken = WebviewSecurity.generateAuthToken();
    try {
      await BackendServer.getInstance().start(0, authToken);
    } catch (serverErr) {
      Logger.error('Failed to bind Express server', serverErr);
    }

    // Register Webview View Provider in Explorer sidebar ONLY
    const webviewProvider = new PetWebviewViewProvider(context.extensionUri);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        PetWebviewViewProvider.viewType,
        webviewProvider,
        { webviewOptions: { retainContextWhenHidden: true } }
      )
    );

    DeveloperReactions.getInstance().register(context);

    // Register Commands
    const registerCmd = (commandId: string, handler: (...args: any[]) => any) => {
      const disposable = vscode.commands.registerCommand(commandId, async (...args: any[]) => {
        try {
          await handler(...args);
        } catch (cmdErr) {
          Logger.error(`Command failed: ${commandId}`, cmdErr);
        }
      });
      context.subscriptions.push(disposable);
    };

    registerCmd('vscodePet.addPet', addPetCommand);
    registerCmd('vscodePet.removePet', (petId) => removePetCommand(petId));
    registerCmd('vscodePet.feedPet', feedPetCommand);
    registerCmd('vscodePet.throwBall', throwBallCommand);
    registerCmd('vscodePet.changeTheme', changeThemeCommand);
    registerCmd('vscodePet.resetPets', resetPetsCommand);
    registerCmd('vscodePet.openSettings', openSettingsCommand);

    Logger.info('VS Code Pet activated successfully! 🐾');
  } catch (err) {
    Logger.error('Failure activating VS Code Pet', err);
  }
}

export async function deactivate(): Promise<void> {
  try {
    await BackendServer.getInstance().stop();
  } catch (err) {
    Logger.error('Error stopping backend', err);
  }
  Logger.dispose();
}
