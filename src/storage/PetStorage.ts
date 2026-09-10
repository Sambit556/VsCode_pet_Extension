import * as vscode from 'vscode';
import { IPetData, PetSpecies, PetColor, PetState, PetSurface } from '../pets/PetTypes';
import { Logger } from '../utils/Logger';

const PET_STORAGE_KEY = 'vscodePet.pets.v2';

export class PetStorage {
  private globalState: vscode.Memento;

  constructor(globalState: vscode.Memento) {
    this.globalState = globalState;
  }

  public loadPets(): IPetData[] {
    try {
      const raw = this.globalState.get<unknown>(PET_STORAGE_KEY);
      if (!raw || !Array.isArray(raw)) {
        return [];
      }

      const validPets: IPetData[] = [];
      for (const item of raw) {
        const validated = this.validateAndNormalizePet(item);
        if (validated) {
          validPets.push(validated);
        }
      }
      return validPets;
    } catch (err) {
      Logger.error('Failed to load pets from storage. Using safe defaults.', err);
      return [];
    }
  }

  public async savePets(pets: IPetData[]): Promise<boolean> {
    try {
      const validated = pets
        .map((p) => this.validateAndNormalizePet(p))
        .filter((p): p is IPetData => p !== null);
      await this.globalState.update(PET_STORAGE_KEY, validated);
      return true;
    } catch (err) {
      Logger.error('Failed to persist pets to storage.', err);
      return false;
    }
  }

  public async clearAll(): Promise<void> {
    try {
      await this.globalState.update(PET_STORAGE_KEY, undefined);
    } catch (err) {
      Logger.error('Failed to clear pet storage.', err);
    }
  }

  public validateAndNormalizePet(raw: unknown): IPetData | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const obj = raw as Record<string, any>;
    if (typeof obj.id !== 'string' || obj.id.trim() === '') {
      return null;
    }

    const validSpecies: PetSpecies[] = ['cat', 'dog', 'fox', 'duck', 'rabbit', 'penguin'];
    const species: PetSpecies = validSpecies.includes(obj.species) ? obj.species : 'cat';

    const validColors: PetColor[] = ['brown', 'black', 'white', 'orange', 'yellow', 'green', 'gray'];
    const color: PetColor = validColors.includes(obj.color) ? obj.color : 'orange';

    const validSurfaces: PetSurface[] = ['floor', 'wall_left', 'wall_right', 'ceiling', 'air', 'platform'];
    const surface: PetSurface = validSurfaces.includes(obj.surface) ? obj.surface : 'floor';

    const validStates: PetState[] = [
      'idle', 'walking', 'running', 'climbing', 'sleeping',
      'jumping', 'sitting', 'eating', 'celebrating', 'swiping'
    ];
    const state: PetState = validStates.includes(obj.state) ? obj.state : 'walking';

    const clamp = (val: unknown, min: number, max: number, def: number): number => {
      const num = typeof val === 'number' && !isNaN(val) ? val : def;
      return Math.max(min, Math.min(max, num));
    };

    return {
      id: String(obj.id),
      name: typeof obj.name === 'string' && obj.name.trim().length > 0 ? obj.name.slice(0, 25) : 'Pet',
      species,
      color,
      position: {
        x: clamp(obj.position?.x, 0, 800, 30),
        y: clamp(obj.position?.y, 0, 500, 70)
      },
      direction: typeof obj.direction === 'number' && obj.direction < 0 ? -1 : 1,
      surface,
      state,
      frame: typeof obj.frame === 'number' ? obj.frame : 0,
      mood: clamp(obj.mood, 0, 100, 90),
      hunger: clamp(obj.hunger, 0, 100, 20),
      energy: clamp(obj.energy, 0, 100, 95),
      createdAt: typeof obj.createdAt === 'number' ? obj.createdAt : Date.now(),
      updatedAt: Date.now()
    };
  }
}
