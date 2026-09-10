import * as vscode from 'vscode';
import { PetManager } from '../pets/PetManager';

export function feedPetCommand(): void {
  const petManager = PetManager.getInstance();
  const pets = petManager.getAllPets();
  if (pets.length === 0) {
    vscode.window.showInformationMessage('No pets in the playground. Click + to spawn one!');
    return;
  }
  petManager.feedAllPets();
}

export function throwBallCommand(): void {
  const petManager = PetManager.getInstance();
  const res = petManager.throwBall();
  if (!res.success && res.message) {
    vscode.window.showWarningMessage(res.message);
  }
}

export async function resetPetsCommand(): Promise<void> {
  const confirm = await vscode.window.showWarningMessage(
    'Reset all pets in the playground?',
    { modal: true },
    'Reset'
  );

  if (confirm === 'Reset') {
    PetManager.getInstance().resetAllPets();
    vscode.window.showInformationMessage('🔄 Playground reset.');
  }
}

export function openSettingsCommand(): void {
  vscode.commands.executeCommand('workbench.action.openSettings', 'vscodePet');
}
