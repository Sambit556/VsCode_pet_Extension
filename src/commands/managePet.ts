import * as vscode from 'vscode';
import { PetManager } from '../pets/PetManager';

export async function removePetCommand(petId?: string): Promise<void> {
  const petManager = PetManager.getInstance();
  const allPets = petManager.getAllPets();

  if (allPets.length === 0) {
    vscode.window.showInformationMessage('No pets in the playground.');
    return;
  }

  let targetId = petId;
  if (!targetId) {
    const items = [
      {
        label: '$(trash) Delete All Pets',
        description: `Remove all ${allPets.length} pet(s) from playground`,
        petId: '__all__'
      },
      ...allPets.map((p) => ({
        label: `$(close) ${p.name} (${p.species})`,
        description: `Color: ${p.color}`,
        petId: p.id
      }))
    ];

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a pet to delete, or delete all:'
    });
    if (!selected) return;
    targetId = selected.petId;
  }

  if (targetId === '__all__') {
    const confirm = await vscode.window.showWarningMessage(
      'Are you sure you want to remove ALL pets from the playground?',
      { modal: true },
      'Delete All'
    );
    if (confirm === 'Delete All') {
      petManager.resetAllPets();
      vscode.window.showInformationMessage('🗑️ All pets removed.');
    }
    return;
  }

  const pet = petManager.getPet(targetId);
  if (!pet) return;

  const confirm = await vscode.window.showWarningMessage(
    `Delete ${pet.getName()} from the playground?`,
    { modal: true },
    'Delete'
  );

  if (confirm === 'Delete') {
    petManager.removePet(targetId);
    vscode.window.showInformationMessage(`👋 ${pet.getName()} has been removed.`);
  }
}
