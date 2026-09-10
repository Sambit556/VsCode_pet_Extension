import * as vscode from 'vscode';
import { PetManager } from '../pets/PetManager';
import { ConfigurationManager } from '../configuration/ConfigurationManager';
import { BackendServer } from '../backend/server';
import { WebviewHtmlGenerator } from './WebviewHtmlGenerator';
import { WebviewSecurity } from '../security/WebviewSecurity';
import { Logger } from '../utils/Logger';

export class PetWebviewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'vscodePet.explorerView';
  private view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    this.updateWebviewContent();

    // Messages from webview
    webviewView.webview.onDidReceiveMessage((rawMsg) => {
      const validated = WebviewSecurity.validateWebviewMessage(rawMsg);
      if (!validated) return;
      this.handleWebviewMessage(validated);
    });

    const petManager = PetManager.getInstance();
    const petsSub = petManager.onPetsUpdated((pets) => {
      this.postMessage({ type: 'petsUpdated', pets });
    });

    const ballSub = petManager.onBallUpdated((ball) => {
      this.postMessage({ type: 'ballUpdated', ball });
    });

    const feedSub = petManager.onFeed(() => {
      this.postMessage({ type: 'feedEvent' });
    });

    const configManager = ConfigurationManager.getInstance();
    const configSub = configManager.onDidChangeConfiguration(() => {
      this.updateWebviewContent();
    });

    webviewView.onDidDispose(() => {
      petsSub.dispose();
      ballSub.dispose();
      feedSub.dispose();
      configSub.dispose();
      this.view = undefined;
    });
  }

  private updateWebviewContent(): void {
    if (!this.view) return;

    const backend = BackendServer.getInstance();
    const config = ConfigurationManager.getInstance().getConfig();
    const petManager = PetManager.getInstance();

    this.view.webview.html = WebviewHtmlGenerator.generateHtml(
      this.view.webview,
      this.extensionUri,
      backend.getPort(),
      backend.getAuthToken(),
      config.theme,
      config.petSize,
      config.petSpeed,
      config.allowClimbing,
      config.sound,
      petManager.getAllPets()
    );
  }

  private postMessage(message: any): void {
    if (this.view) {
      this.view.webview.postMessage(message);
    }
  }

  private handleWebviewMessage(msg: { command: string; payload?: any }): void {
    const petManager = PetManager.getInstance();

    switch (msg.command) {
      case 'webviewReady': {
        this.postMessage({
          type: 'initData',
          pets: petManager.getAllPets(),
          ball: petManager.getActiveBall()
        });
        break;
      }

      case 'addPet': {
        vscode.commands.executeCommand('vscodePet.addPet');
        break;
      }

      case 'throwBall': {
        petManager.throwBall(msg.payload?.origin);
        break;
      }

      case 'petAction': {
        const { petId, action } = msg.payload || {};
        if (typeof petId !== 'string') return;
        const pet = petManager.getPet(petId);
        if (!pet) return;

        if (action === 'feed') pet.feed();
        else if (action === 'pet') pet.pet();

        this.postMessage({ type: 'petsUpdated', pets: petManager.getAllPets() });
        break;
      }

      case 'log': {
        if (typeof msg.payload?.text === 'string') {
          Logger.debug(`[Webview] ${msg.payload.text}`);
        }
        break;
      }
    }
  }
}
