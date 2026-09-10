import * as vscode from 'vscode';
import { WebviewSecurity } from '../security/WebviewSecurity';
import { PetTheme, PetSize, IPetData } from '../pets/PetTypes';
import { getThemeEnvironmentHtml } from './webview/themeProps';

export class WebviewHtmlGenerator {
  public static generateHtml(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
    backendPort: number,
    authToken: string,
    theme: PetTheme,
    petSize: PetSize,
    petSpeed: string,
    allowClimbing: boolean,
    sound: boolean,
    initialPets: IPetData[] = []
  ): string {
    const nonce = WebviewSecurity.generateNonce();
    const csp = WebviewSecurity.getCSP(webview, extensionUri, nonce, backendPort);

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, 'dist', 'webview', 'petPlayground.js')
    );

    const { bgHtml, fgHtml } = getThemeEnvironmentHtml(theme);
    const serializedPets = JSON.stringify(initialPets).replace(/</g, '\\u003c');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VS Code Pets</title>
  <style>
    :root {
      --pet-ground-color: rgba(255, 255, 255, 0.08);
      --pet-ground-border: rgba(255, 255, 255, 0.12);
      --font-family: var(--vscode-font-family, -apple-system, sans-serif);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    body {
      background-color: var(--vscode-sideBar-background, transparent);
      color: var(--vscode-sideBar-foreground, #ccc);
      font-family: var(--font-family);
      overflow: hidden;
      height: 100vh;
      width: 100vw;
      position: relative;
    }

    /* 90s RETRO THEMES (Muted, nostalgic vintage palettes) */
    body.theme-none {
      --pet-ground-color: rgba(255, 255, 255, 0.08);
      --pet-ground-border: rgba(255, 255, 255, 0.12);
      background-color: var(--vscode-sideBar-background, transparent);
    }
    body.theme-forest {
      --pet-ground-color: #3b523f;
      --pet-ground-border: #233327;
      background: linear-gradient(180deg, #121a14 0%, #1c291f 35%, #27382b 70%, #344738 100%);
    }
    body.theme-autumn {
      --pet-ground-color: #5c4333;
      --pet-ground-border: #36261c;
      background: linear-gradient(180deg, #18110c 0%, #261b14 35%, #3a2a1f 70%, #4d3829 100%);
    }
    body.theme-castle {
      --pet-ground-color: #3d4550;
      --pet-ground-border: #242930;
      background: linear-gradient(180deg, #101317 0%, #1a1f26 35%, #272e38 70%, #37414f 100%);
    }
    body.theme-beach {
      --pet-ground-color: #7d6e53;
      --pet-ground-border: #4d4433;
      background: linear-gradient(180deg, #131d26 0%, #1d2c3b 35%, #2a3e52 65%, #574d3b 90%, #6e6149 100%);
    }
    body.theme-winter {
      --pet-ground-color: #798d9e;
      --pet-ground-border: #4e5c68;
      background: linear-gradient(180deg, #10161c 0%, #19232c 35%, #24323f 70%, #425567 100%);
    }
    body.theme-cyberpunk {
      --pet-ground-color: #445e47;
      --pet-ground-border: #1d2b1f;
      background: linear-gradient(180deg, #0e1710 0%, #17261a 35%, #223827 70%, #304f37 100%);
    }

    #playground {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      cursor: default;
    }

    /* THEME PROPS LAYERS */
    .env-obj {
      position: absolute;
      pointer-events: none;
      shape-rendering: crispEdges;
    }
    .bg-prop {
      z-index: 2;
      opacity: 0.85;
    }
    .fg-prop {
      z-index: 15;
    }

    .ground-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: var(--pet-ground-color);
      border-top: 1px solid var(--pet-ground-border);
      pointer-events: none;
      z-index: 1;
    }

    /* PET ENTITY */
    .pet-entity {
      position: absolute;
      image-rendering: pixelated;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-origin: bottom center;
      will-change: transform;
    }

    /* SIZES */
    .size-nano .pet-entity { width: 24px; height: 24px; }
    .size-small .pet-entity { width: 32px; height: 32px; }
    .size-medium .pet-entity { width: 40px; height: 40px; }
    .size-large .pet-entity { width: 48px; height: 48px; }

    .pixel-pet-svg {
      width: 100%;
      height: 100%;
      shape-rendering: crispEdges;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));
    }

    /* SPEECH BUBBLE */
    .pet-bubble {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-4px);
      background: rgba(15, 15, 15, 0.92);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 6px;
      padding: 2px 6px;
      font-size: 10px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 30;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      animation: bubblePop 0.18s ease-out;
    }

    @keyframes bubblePop {
      0% { opacity: 0; transform: translateX(-50%) translateY(0) scale(0.7); }
      100% { opacity: 1; transform: translateX(-50%) translateY(-4px) scale(1); }
    }

    /* BALL */
    .ball-entity {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ff4b4b, #b91c1c);
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
      z-index: 12;
      pointer-events: none;
    }

    /* BALL SHARDS (30-sec break pieces) */
    .ball-shard {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: #ff4b4b;
      box-shadow: 0 0 4px #ff0000;
      pointer-events: none;
      z-index: 25;
      animation: shardFly 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }

    @keyframes shardFly {
      0% {
        transform: translate(0, 0) scale(1.3) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translate(var(--tx), var(--ty)) scale(0.2) rotate(360deg);
        opacity: 0;
      }
    }

    /* FOOD ITEM */
    .food-entity {
      position: absolute;
      font-size: 14px;
      z-index: 12;
      pointer-events: none;
      animation: dropBounce 0.35s ease-out;
    }

    @keyframes dropBounce {
      0% { transform: translateY(-16px); opacity: 0; }
      70% { transform: translateY(0); opacity: 1; }
      85% { transform: translateY(-4px); }
      100% { transform: translateY(0); }
    }

    /* EMPTY HELPER */
    #empty-hint {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 11px;
      color: var(--vscode-descriptionForeground, #888);
      text-align: center;
      display: none;
      pointer-events: none;
    }
  </style>
</head>
<body
  class="theme-${theme} size-${petSize}"
  data-theme="${theme}"
  data-backend-port="${backendPort}"
  data-auth-token="${authToken}"
  data-pet-speed="${petSpeed}"
  data-allow-climbing="${allowClimbing}"
  data-pet-size="${petSize}"
  data-sound="${sound}"
  data-initial-pets="${Buffer.from(serializedPets).toString('base64')}"
>
  <div id="playground">
    <div id="bg-decor">${bgHtml}</div>
    <div class="ground-line"></div>
    <div id="pets-layer"></div>
    <div id="ball-layer"></div>
    <div id="food-layer"></div>
    <div id="fg-decor">${fgHtml}</div>
    <div id="empty-hint">🐾 Click <b>+</b> in the top right to spawn a pet!</div>
  </div>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}
