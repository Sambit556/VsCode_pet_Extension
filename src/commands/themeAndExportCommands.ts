import * as vscode from 'vscode';
import { PetTheme } from '../pets/PetTypes';

export async function changeThemeCommand(): Promise<void> {
  const themes: { label: string; theme: PetTheme; description: string }[] = [
    { label: '✨ None (Transparent)', theme: 'none', description: 'Blends into VS Code editor background' },
    { label: '🌲 Forest Meadow', theme: 'forest', description: 'Pine trees, green grass and mushrooms' },
    { label: '🍁 Autumn Leaves', theme: 'autumn', description: 'Warm amber trees, log stump and pumpkin' },
    { label: '🏖️ Beach Sand', theme: 'beach', description: 'Palm tree, umbrella, seashell and sand' },
    { label: '🏰 Castle Wall', theme: 'castle', description: 'Stone battlements, crates and flickering torch' },
    { label: '❄️ Winter Snow', theme: 'winter', description: 'Snowy pine trees and snowman' },
    { label: '🟩 Cyberpunk City', theme: 'cyberpunk', description: 'Digital terminal and glowing neon grid' }
  ];

  const selected = await vscode.window.showQuickPick(themes, {
    placeHolder: 'Select a theme for your pet playground:'
  });

  if (selected) {
    const config = vscode.workspace.getConfiguration('vscodePet');
    await config.update('theme', selected.theme, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`🎨 Theme changed to ${selected.label}!`);
  }
}
