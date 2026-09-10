import * as vscode from 'vscode';
import { PetManager } from '../pets/PetManager';
import { PET_DEFINITIONS } from '../utils/Constants';
import { PetSpecies, PetColor } from '../pets/PetTypes';

export async function addPetCommand(): Promise<void> {
  const petManager = PetManager.getInstance();

  // 1. Pick species
  const speciesList = Object.values(PET_DEFINITIONS);
  const selectedSpecies = await vscode.window.showQuickPick(
    speciesList.map((s) => ({
      label: `${s.emoji} ${s.displayName}`,
      species: s.species
    })),
    { placeHolder: 'Select pet type:' }
  );

  if (!selectedSpecies) return;
  const def = PET_DEFINITIONS[selectedSpecies.species as PetSpecies];

  // 2. Pick color
  const selectedColor = await vscode.window.showQuickPick(
    def.availableColors.map((c) => ({
      label: c.charAt(0).toUpperCase() + c.slice(1),
      color: c
    })),
    { placeHolder: `Select color for ${def.displayName}:` }
  );

  if (!selectedColor) return;

  // 3. Name (with cute random default)
  const defaultName = def.defaultNames[Math.floor(Math.random() * def.defaultNames.length)];
  const petName = await vscode.window.showInputBox({
    prompt: `Name your ${def.displayName}:`,
    value: defaultName,
    valueSelection: [0, defaultName.length]
  });

  if (petName === undefined) return;

  const pet = petManager.createPet({
    name: petName.trim() || defaultName,
    species: selectedSpecies.species as PetSpecies,
    color: selectedColor.color as PetColor
  });

  if (pet) {
    vscode.window.showInformationMessage(`🐾 ${pet.getName()} has joined the playground!`);
  }
}
